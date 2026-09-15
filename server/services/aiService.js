import http from 'http';
import https from 'https';
import { URL } from 'url';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Invokes the Python FastAPI AI Microservice.
 * Falls back to built-in resilient mock analysis if the AI microservice is temporarily unavailable.
 */
export async function analyzeSiteEvidence({
  evidenceId,
  fileUrl,
  filePath,
  fileName,
  fileType,
  evidenceType,
  context
}) {
  const payload = JSON.stringify({
    evidenceId,
    fileUrl,
    filePath,
    fileName,
    fileType,
    evidenceType,
    context: context || {}
  });

  const parsedUrl = new URL(`${AI_SERVICE_URL}/ai/analyze-evidence`);
  const isHttps = parsedUrl.protocol === 'https:';
  const client = isHttps ? https : http;

  try {
    const aiResponse = await new Promise((resolve, reject) => {
      const req = client.request(
        parsedUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          },
          timeout: 45000 // 45 sec timeout for AI vision / OCR
        },
        (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              try {
                resolve(JSON.parse(body));
              } catch (e) {
                reject(new Error(`Invalid JSON from AI service: ${body}`));
              }
            } else {
              reject(new Error(`AI Service returned HTTP ${res.statusCode}: ${body}`));
            }
          });
        }
      );

      req.on('error', err => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('AI Service request timed out'));
      });

      req.write(payload);
      req.end();
    });

    return aiResponse;
  } catch (error) {
    console.warn(`[aiService] Warning: Python AI service connection failed (${error.message}). Activating local resilient AI engine.`);
    
    // Built-in resilient mock fallback matching Phase 4 SIH demo specification
    const nameLower = (fileName || fileUrl || '').toLowerCase();
    const isPhoto = (evidenceType || 'PHOTO').toUpperCase() === 'PHOTO';
    const actName = context?.activityName || 'Foundation Construction';

    let mockAnalysis;
    if (nameLower.includes('foundation') || nameLower.includes('dpr') || (context?.activityCode && context.activityCode.includes('CIV-023'))) {
      mockAnalysis = {
        activityName: actName,
        location: 'Zone A',
        date: new Date().toISOString().split('T')[0],
        quantity: isPhoto ? null : 65.0,
        unit: 'm3',
        progressPercentage: 81.0,
        workStatus: 'IN_PROGRESS',
        issues: ['Reinforcement material shortage'],
        remarks: isPhoto 
          ? 'Pier 15 foundation footing concrete pour inspected. Transit mixer and pumping equipment active.'
          : 'Foundation work at Zone A completed up to 65 cubic meters. Progress slightly constrained by rebar dispatch delay.',
        materials: ['Reinforcement steel TMT 500D', 'Ready-mix concrete M35'],
        manpower: '1 Supervisor, 8 Steel fixers, 5 Laborers',
        equipment: ['Transit Mixer (Batching truck #08)', 'Needle Vibrators'],
        confidenceScore: isPhoto ? 88 : 94
      };
    } else {
      mockAnalysis = {
        activityName: actName,
        location: 'Main Construction Section',
        date: new Date().toISOString().split('T')[0],
        quantity: isPhoto ? null : 40.0,
        unit: 'm3',
        progressPercentage: 70.0,
        workStatus: 'IN_PROGRESS',
        issues: [],
        remarks: 'Site execution inspected against baseline WBS schedule.',
        materials: ['Structural materials'],
        manpower: 'Field execution crew',
        equipment: ['Heavy construction machinery'],
        confidenceScore: 86
      };
    }

    return {
      success: true,
      mode: 'MOCK_AI',
      provider: 'node_resilient_fallback',
      analysis: mockAnalysis,
      rawResponse: JSON.stringify(mockAnalysis, null, 2),
      warning: `Used Node fallback because Python AI service was unreachable: ${error.message}`
    };
  }
}

/**
 * Health check to inspect AI microservice availability and live mode
 */
export async function checkAIServiceHealth() {
  const parsedUrl = new URL(`${AI_SERVICE_URL}/health`);
  const isHttps = parsedUrl.protocol === 'https:';
  const client = isHttps ? https : http;

  try {
    return await new Promise((resolve) => {
      const req = client.get(parsedUrl, { timeout: 3000 }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve({ status: 'unreachable', mode: 'MOCK_AI' });
          }
        });
      });
      req.on('error', () => resolve({ status: 'unreachable', mode: 'MOCK_AI' }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 'timeout', mode: 'MOCK_AI' });
      });
    });
  } catch {
    return { status: 'unreachable', mode: 'MOCK_AI' };
  }
}
