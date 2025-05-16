import { join } from 'path';
import { readdirSync } from 'fs';

export function loadControllers(): any[] {
  const controllersDir = join(__dirname, '..', 'controller');
  const controllerFiles = readdirSync(controllersDir).filter(
    (file) => file.endsWith('.controller.ts') || file.endsWith('.controller.js'),
  );

  return controllerFiles
    .map((file) => {
      const controllerModule = require(join(controllersDir, file));
      // Prend la première classe exportée qui est une fonction (class en JS)
      const controllerClass = Object.values(controllerModule).find((exp: any) => typeof exp === 'function');
      return controllerClass;
    })
    .filter(Boolean);
}

// peut etre supprimé
