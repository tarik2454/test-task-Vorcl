'use client';

import { useState, useEffect, useRef } from 'react';
import { useLottie } from 'lottie-react';
import freeVoiceAnimation from '../../assets/animations/freeVoiceAnimation.json';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import Section from '@/shared/components/Section';

export default function VoiceRecording() {
  const { View, play, stop } = useLottie({
    animationData: freeVoiceAnimation,
    loop: true,
    autoplay: false,
    style: { width: '100%', height: '100%' },
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionId = useRef<string | null>(null); // Добавим ссылку для сессии

  useEffect(() => {
    // Инициализация WebSocket
    const ws = new WebSocket('wss://api.openai.com/v1/realtime');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket подключен');

      // Отправляем API ключ для аутентификации
      ws.send(
        JSON.stringify({ type: 'authenticate', api_key: 'YOUR_API_KEY' })
      );

      // Создаем сеанс после аутентификации
      const sessionData = {
        model: 'gpt-4o', // Используем модель
        voice: 'alloy', // Пример голосового движка
      };

      ws.send(JSON.stringify({ type: 'session.create', data: sessionData }));
    };

    ws.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.type === 'audio_base64') {
        console.log('Получен Base64 аудио:', message.data);
        // Воспроизводим аудио от сервера
        const audioData = message.data; // получаем аудио в формате Base64
        playAudioFromBase64(audioData); // Воспроизводим аудио
      } else if (message.error) {
        console.error('Ошибка от сервера:', message.error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket отключен');
    };

    ws.onerror = error => {
      console.error('Ошибка WebSocket:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close(); // Закрываем WebSocket при размонтировании
      }
    };
  }, []);

  const floatToBase64 = (float32Array: Float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);

    for (let i = 0; i < float32Array.length; i++) {
      let value = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, value < 0 ? value * 0x8000 : value * 0x7fff, true);
    }

    const uint8Array = new Uint8Array(buffer);
    return btoa(String.fromCharCode(...uint8Array));
  };

  const sendAudioToServer = (audioBuffer: Float32Array) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const base64Audio = floatToBase64(audioBuffer);
      // Отправляем данные с типом 'message'
      wsRef.current.send(
        JSON.stringify({
          type: 'message',
          data: {
            role: 'user',
            content: [
              {
                type: 'input_audio',
                audio: base64Audio,
              },
            ],
          },
        })
      );
    } else {
      console.error('WebSocket не подключен или закрыт');
    }
  };

  const playAudioFromBase64 = (base64Audio: string) => {
    // Преобразуем Base64 строку обратно в бинарные данные
    const audioData = atob(base64Audio);
    const buffer = new ArrayBuffer(audioData.length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < audioData.length; i++) {
      view[i] = audioData.charCodeAt(i);
    }

    // Создаем аудио контекст и воспроизводим
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(
      buffer,
      decodedData => {
        const source = audioContext.createBufferSource();
        source.buffer = decodedData;
        source.connect(audioContext.destination);
        source.start();
      },
      error => {
        console.error('Ошибка при декодировании аудио:', error);
      }
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        audioRef.current.play();
      }

      setIsRecording(true);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = async event => {
        const audioContext = new AudioContext();
        const arrayBuffer = await event.data.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const channelData = audioBuffer.getChannelData(0);

        sendAudioToServer(channelData); // Отправляем данные на сервер
      };

      recorder.start();
    } catch (err) {
      console.error('Ошибка доступа к микрофону:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }

    setIsRecording(false);
  };

  const handleToggle = () => {
    if (isPlaying) {
      stop();
      stopRecording();
    } else {
      play();
      startRecording();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Section styles={'min-w-[552px]'}>
      <div className="mb-[26px] text-center">
        {isRecording && mediaRecorder ? (
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorder}
            width={213}
            height={15}
            barColor={'violet'}
          />
        ) : (
          'Start a conversation with assistants'
        )}
      </div>

      <div
        className={`cursor-pointer w-[185px] h-[176px] mx-auto block ${
          isPlaying ? 'svg-style' : ''
        }`}
        onClick={handleToggle}
      >
        {View}
      </div>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </Section>
  );
}
