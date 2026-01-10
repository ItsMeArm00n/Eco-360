'use server';

import { spawn } from 'child_process';
import path from 'path';

interface PredictionFeatures {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  uv_index: number;
  AQI: number;
  heat_index: number;
  time_of_day: string;
  day_type: string;
  commute_mode: string;
  routine_sensitivity: string;
}

export async function predictDisruption(features: PredictionFeatures) {
  return new Promise((resolve, reject) => {
    // Path to the python script
    const scriptPath = path.join(process.cwd(), 'scripts', 'predict_routine.py');
    
    // Spawn python process
    // Try 'python' first (common on Windows), catch error and try 'python3' if needed? 
    // Usually on Windows 'python' is the alias.
    const pythonProcess = spawn('python', [scriptPath]);

    let dataString = '';
    let errorString = '';

    // Send data to stdin
    pythonProcess.stdin.write(JSON.stringify(features));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorString);
        resolve({ 
            error: "Failed to run prediction model", 
            details: errorString 
        });
        return;
      }

      try {
        const result = JSON.parse(dataString);
        resolve(result);
      } catch (e) {
        resolve({ error: "Failed to parse model output", details: dataString });
      }
    });
    
    pythonProcess.on('error', (err) => {
        resolve({ error: "Could not execute python command", details: err.message });
    });
  });
}
