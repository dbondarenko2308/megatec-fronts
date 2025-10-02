import { deleteAsync } from 'del';
import { filePaths } from '../config/paths.js';

const reset = () => {
  return deleteAsync(filePaths.clean);
};

export { reset };