'use client';

import { useState, useEffect, useRef } from 'react';
import { useLottie } from 'lottie-react';
import freeVoiceAnimation from '../../assets/animations/freeVoiceAnimation.json';
import { LiveAudioVisualizer } from 'react-audio-visualize';

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

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Запуск записи
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        audioRef.current.play();
      }

      setIsRecording(true);

      // Создаем MediaRecorder
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      // Начинаем запись
      recorder.start();
    } catch (err) {
      console.error('Ошибка доступа к микрофону:', err);
    }
  };

  // Остановка записи
  const stopRecording = () => {
    if (audioStream) {
      const tracks = audioStream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setAudioStream(null);
    setIsRecording(false);

    if (mediaRecorder) {
      mediaRecorder.stop();
    }
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
    <section className="w-[552px] pt-[77px] px-[168px] pb-[20px] bg-secondaryBackground rounded-xl">
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
    </section>
  );
}
