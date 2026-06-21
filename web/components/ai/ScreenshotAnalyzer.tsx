'use client';

import React, { useState, useRef } from 'react';
import { Upload, Loader, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Signal, ScreenshotAnalysisResult } from '@/types';

interface ScreenshotAnalyzerProps {
  onSignalReceived?: (signal: Signal) => void;
}

export const ScreenshotAnalyzer = ({ onSignalReceived }: ScreenshotAnalyzerProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScreenshotAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeMB = parseFloat(process.env.NEXT_PUBLIC_MAX_SCREENSHOT_SIZE_MB || '10');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max size: ${maxSizeMB}MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WebP)');
      return;
    }

    setImage(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BOT_API_URL}/api/analyze-screenshot`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ screenshot_base64: base64 }),
          }
        );

        const data: ScreenshotAnalysisResult = await response.json();

        if (data.success) {
          setResult(data);
          onSignalReceived?.(data.signal!);
        } else {
          setError(data.message || 'Analysis failed');
        }
      };
      reader.readAsDataURL(image);
    } catch (err) {
      setError('Error uploading screenshot');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setError(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-5 h-5 text-blue-500" />
        <h2 className="text-white font-bold text-lg">Upload Chart Screenshot</h2>
      </div>

      {!preview && (
        <div
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Drag and drop your chart screenshot here</p>
          <p className="text-slate-400 text-sm mt-1">or click to browse</p>
          <p className="text-slate-500 text-xs mt-3">Max size: {maxSizeMB}MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {preview && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Chart preview"
              className="w-full rounded-lg border border-slate-600"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
            {!isLoading && !result && (
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {!result && (
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Analyze Chart
                </>
              )}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-900 border border-red-700 rounded-lg p-4 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {result && <AnalysisResult result={result} onClear={handleClear} />}
    </div>
  );
};

interface AnalysisResultProps {
  result: ScreenshotAnalysisResult;
  onClear: () => void;
}

const AnalysisResult = ({ result, onClear }: AnalysisResultProps) => {
  const verification = result.verification;
  const signal = result.signal;

  const getVerificationColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getVerificationBg = (score: number) => {
    if (score >= 80) return 'bg-green-900';
    if (score >= 60) return 'bg-yellow-900';
    return 'bg-red-900';
  };

  return (
    <div className="mt-6 space-y-4">
      <div className={`rounded-lg p-4 border ${getVerificationBg(verification.score)} border-opacity-50`}>
        <div className="flex items-center gap-3 mb-3">
          {verification.score >= 60 ? (
            <CheckCircle className={`w-5 h-5 ${getVerificationColor(verification.score)}`} />
          ) : (
            <AlertCircle className={`w-5 h-5 ${getVerificationColor(verification.score)}`} />
          )}
          <div>
            <p className="text-slate-300 text-sm font-medium">Verification Score</p>
            <p className={`text-2xl font-bold ${getVerificationColor(verification.score)}`}>
              {verification.score}/100
            </p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-slate-400">
            <span className="font-medium">Source:</span> {verification.data_source}
          </p>
          <p className="text-slate-400">
            <span className="font-medium">Confidence Boost:</span> {verification.confidence_boost}
          </p>
          {verification.vision_confidence !== undefined && (
            <p className="text-slate-400">
              <span className="font-medium">Chart Confidence:</span> {(verification.vision_confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      </div>

      <div className="bg-slate-700 rounded-lg p-4">
        <p className="text-slate-300 font-medium mb-3">Signal Details</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Trend:</span>
            <span className="text-white font-medium">{signal?.trend}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Support:</span>
            <span className="text-white font-medium">${signal?.support_level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Resistance:</span>
            <span className="text-white font-medium">${signal?.resistance_level}</span>
          </div>
        </div>
      </div>

      {verification.discrepancies && verification.discrepancies.length > 0 && (
        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-300 font-medium mb-3">Notes & Discrepancies</p>
          <ul className="space-y-2 text-sm">
            {verification.discrepancies.map((disc: string, idx: number) => (
              <li key={idx} className="text-slate-400 flex gap-2">
                <span className="text-yellow-500">•</span>
                {disc}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onClear}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded transition"
        >
          Analyze Another
        </button>
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition">
          Copy Signal
        </button>
      </div>
    </div>
  );
};
