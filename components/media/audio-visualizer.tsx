'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AudioVisualizer = ({ audioElement }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [source, setSource] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [visualizerType, setVisualizerType] = useState('bars');
  const [eqPreset, setEqPreset] = useState('flat');
  const [filters, setFilters] = useState([]);
  
  const eqBands = [
    { freq: 60, gain: 0, label: '60Hz' },
    { freq: 170, gain: 0, label: '170Hz' },
    { freq: 310, gain: 0, label: '310Hz' },
    { freq: 600, gain: 0, label: '600Hz' },
    { freq: 1000, gain: 0, label: '1kHz' },
    { freq: 3000, gain: 0, label: '3kHz' },
    { freq: 6000, gain: 0, label: '6kHz' },
    { freq: 12000, gain: 0, label: '12kHz' },
    { freq: 14000, gain: 0, label: '14kHz' },
    { freq: 16000, gain: 0, label: '16kHz' },
  ].map((band, index) => ({ ...band, id: index }));

  const presets = {
    flat: eqBands.map(band => ({ ...band, gain: 0 })),
    bass: eqBands.map(band => ({
      ...band,
      gain: band.freq < 300 ? 6 : band.freq < 1000 ? 3 : 0
    })),
    vocal: eqBands.map(band => ({
      ...band,
      gain: band.freq > 1000 && band.freq < 6000 ? 3 : 0
    })),
    electronic: eqBands.map(band => ({
      ...band,
      gain: band.freq < 100 ? 4 : band.freq > 8000 ? 3 : 1
    }))
  };

  // Initialize audio context
  useEffect(() => {
    if (!audioContext) {
      const newContext = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(newContext);
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Setup audio nodes when context and audio element are available
  useEffect(() => {
    if (!audioContext || !audioElement) return;

    const setupAudio = async () => {
      // Clean up previous connections
      if (source) {
        source.disconnect();
      }

      // Create new source
      const newSource = audioContext.createMediaElementSource(audioElement);
      setSource(newSource);

      const analyserNode = audioContext.createAnalyser();
      
      // Create filters for each EQ band
      const eqFilters = eqBands.map(band => {
        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = band.freq;
        filter.Q.value = 1;
        filter.gain.value = band.gain;
        return filter;
      });

      // Connect the audio nodes
      newSource.connect(eqFilters[0]);
      eqFilters.forEach((filter, i) => {
        if (i < eqFilters.length - 1) {
          filter.connect(eqFilters[i + 1]);
        }
      });
      eqFilters[eqFilters.length - 1].connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      setAnalyser(analyserNode);
      setFilters(eqFilters);
    };

    setupAudio().catch(console.error);

    return () => {
      if (source) {
        source.disconnect();
      }
    };
  }, [audioContext, audioElement]);

  // Visualizer drawing logic
  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(15, 23, 42)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (visualizerType === 'bars') {
        const barWidth = canvas.width / bufferLength * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(1, '#60a5fa');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      } else if (visualizerType === 'wave') {
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        
        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, visualizerType]);

  const handlePresetChange = (value) => {
    setEqPreset(value);
    const newSettings = presets[value];
    newSettings.forEach((band, i) => {
      if (filters[i]) {
        filters[i].gain.value = band.gain;
      }
    });
  };

  const handleBandChange = (index, value) => {
    if (filters[index]) {
      filters[index].gain.value = value[0];
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Equalizer & Visualizer</CardTitle>
          <div className="flex gap-4">
            <Select value={eqPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="bass">Bass Boost</SelectItem>
                <SelectItem value="vocal">Vocal Boost</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visualizerType} onValueChange={setVisualizerType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Visualizer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bars">Bars</SelectItem>
                <SelectItem value="wave">Waveform</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="w-full rounded-lg bg-slate-900"
          />
        </div>
        <div className="grid grid-cols-10 gap-4">
          {eqBands.map((band, index) => (
            <div key={band.id} className="flex flex-col items-center gap-2">
              <Slider
                orientation="vertical"
                className="h-32"
                min={-12}
                max={12}
                step={0.1}
                value={[filters[index]?.gain.value || 0]}
                onValueChange={(value) => handleBandChange(index, value)}
              />
              <span className="text-xs font-medium">{band.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioVisualizer;