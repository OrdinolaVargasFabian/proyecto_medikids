/**
 * Utility functions for face anti-spoofing: blink detection, head turn detection,
 * and descriptor operations. Designed for face-api.js 0.22.x.
 *
 * Landmark indices (68-point model):
 *   Left eye:  36-41  |  Right eye: 42-47
 *   Nose tip:  30     |  Nose bridge top: 27
 *   Jaw left:  0      |  Jaw right: 16
 */

/**
 * Calculate Eye Aspect Ratio (EAR) for blink detection.
 * EAR = (vertical_dist1 + vertical_dist2) / (2 * horizontal_dist)
 * A blink occurs when EAR drops below ~0.22.
 *
 * @param {Array} eyePoints - Array of 6 {x, y} points for one eye
 * @returns {number} EAR value
 */
export function calculateEAR(eyePoints) {
  if (!eyePoints || eyePoints.length < 6) return 1.0;

  const p1 = eyePoints[0];
  const p2 = eyePoints[1];
  const p3 = eyePoints[2];
  const p4 = eyePoints[3];
  const p5 = eyePoints[4];
  const p6 = eyePoints[5];

  const vertical1 = distance(p2, p6);
  const vertical2 = distance(p3, p5);
  const horizontal = distance(p1, p4);

  if (horizontal < 0.5) return 1.0;
  return (vertical1 + vertical2) / (2.0 * horizontal);
}

/**
 * Calculate combined EAR for both eyes.
 *
 * @param {Array} landmarks - face-api.js landmarks object with .positions
 * @returns {{ left: number, right: number, avg: number }}
 */
export function getBothEyesEAR(landmarks) {
  if (!landmarks || !landmarks.positions) return { left: 1.0, right: 1.0, avg: 1.0 };

  const leftEye = landmarks.positions.slice(36, 42);
  const rightEye = landmarks.positions.slice(42, 48);

  const leftEAR = calculateEAR(leftEye);
  const rightEAR = calculateEAR(rightEye);

  return {
    left: leftEAR,
    right: rightEAR,
    avg: (leftEAR + rightEAR) / 2.0,
  };
}

/**
 * Detect head turn direction from nose tip position relative to face bounding box.
 * Positive = head turned to the viewer's right (nose left of center).
 * Negative = head turned to the viewer's left (nose right of center).
 *
 * @param {Object} detection - face-api.js detection with .detection.box
 * @param {Array} landmarks - face-api.js landmarks with .positions
 * @returns {number} Head turn ratio (-1 to 1, 0 = straight)
 */
export function getHeadTurnRatio(detection, landmarks) {
  if (!detection || !landmarks || !landmarks.positions) return 0;

  const nose = landmarks.positions[30];
  const box = detection.detection.box;

  const faceCenterX = box.x + box.width / 2;
  const noseOffsetX = nose.x - faceCenterX;
  const headTurnRatio = noseOffsetX / (box.width / 2);

  return Math.max(-1, Math.min(1, headTurnRatio));
}

/**
 * Determine head turn direction from ratio.
 * @param {number} ratio - from getHeadTurnRatio()
 * @returns {'FRENTE'|'IZQUIERDA'|'DERECHA'}
 */
export function getHeadTurnDirection(ratio) {
  if (ratio < -0.18) return 'IZQUIERDA';
  if (ratio > 0.18) return 'DERECHA';
  return 'FRENTE';
}

/**
 * Check if a descriptor is valid (non-zero, correct length).
 * @param {Float32Array} descriptor
 * @returns {boolean}
 */
export function isDescriptorValid(descriptor) {
  if (!descriptor || descriptor.length !== 128) return false;
  for (let i = 0; i < descriptor.length; i++) {
    if (descriptor[i] !== 0) return true;
  }
  return false;
}

/**
 * Average multiple Float32Array descriptors.
 * @param {Float32Array[]} descriptors
 * @returns {Float32Array}
 */
export function averageDescriptors(descriptors) {
  if (!descriptors || descriptors.length === 0) return null;
  const avg = new Float32Array(128);
  for (const desc of descriptors) {
    for (let i = 0; i < 128; i++) {
      avg[i] += desc[i] / descriptors.length;
    }
  }
  return avg;
}

/**
 * Euclidean distance between two points.
 */
function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

/**
 * Check if face is frontal (not turned sideways) using landmark positions.
 * Compares nose tip offset from eye center vs eye distance.
 * @param {Object} landmarks - face-api.js landmarks object
 * @returns {boolean}
 */
export function isFaceFrontal(landmarks) {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const nose = landmarks.getNose();

  const leftEyeX = leftEye.reduce((s, p) => s + p.x, 0) / leftEye.length;
  const rightEyeX = rightEye.reduce((s, p) => s + p.x, 0) / rightEye.length;
  const eyesCenterX = (leftEyeX + rightEyeX) / 2;
  const noseTipX = nose[3].x;

  const horizontalOffset = Math.abs(noseTipX - eyesCenterX);
  const eyeDistance = Math.abs(rightEyeX - leftEyeX);

  return (horizontalOffset / eyeDistance) < 0.25;
}

/**
 * Check if face is vertically aligned (not tilted up/down).
 * @param {Object} landmarks - face-api.js landmarks object
 * @returns {boolean}
 */
export function isFaceVertical(landmarks) {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const nose = landmarks.getNose();

  const leftEyeY = leftEye.reduce((s, p) => s + p.y, 0) / leftEye.length;
  const rightEyeY = rightEye.reduce((s, p) => s + p.y, 0) / rightEye.length;
  const eyesCenterY = (leftEyeY + rightEyeY) / 2;
  const noseTipY = nose[3].y;

  const leftEyeX = leftEye.reduce((s, p) => s + p.x, 0) / leftEye.length;
  const rightEyeX = rightEye.reduce((s, p) => s + p.x, 0) / rightEye.length;
  const eyeDistance = Math.abs(rightEyeX - leftEyeX);

  const verticalOffset = noseTipY - eyesCenterY;

  return verticalOffset > eyeDistance * 0.5 && verticalOffset < eyeDistance * 2.5;
}
