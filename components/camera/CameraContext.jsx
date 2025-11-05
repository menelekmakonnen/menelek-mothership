import { createContext } from 'react';

const CameraContext = createContext({
  cameraSettings: {},
  updateSetting: () => {},
  changeLens: () => {}
});

export default CameraContext;
