// What's on stage beside the graphic: the camera, and whether the graphic is showing. Not saved: the camera starts
// off on every load. Turning the camera on hides the graphic until you bring it in.
export type Stage = {
  webcam: boolean;
  /** A videoinput deviceId, or "" for the default camera. */
  deviceId: string;
  mirror: boolean;
  showGraphic: boolean;
};

export const DEFAULT_STAGE: Stage = { webcam: false, deviceId: "", mirror: false, showGraphic: true };
