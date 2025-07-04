import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

describe('Clean Architecture Compliance', () => {
  const srcPath = path.resolve(__dirname, '../../src');

  const layerMapping = {
    core: ['src/core'],
    useCases: ['src/core/use-cases', 'src/use-cases'],
    infrastructure: ['src/infrastructure'],
    interface: ['src/interface'],
    application: ['src/application'],
  };

  const allowedDependencies = {
    core: [],
    useCases: ['core'],
    infrastructure: ['core', 'useCases'],
    interface: ['core', 'useCases', 'application'],
    application: ['core', 'useCases', 'infrastructure'],
  };

  function getImports(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.ES2020,
      true,
    );

    const imports: string[] = [];

    function visit(node: ts.Node) {
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier
          .getText()
          .replace(/['"`]/g, '');
        if (moduleSpecifier.startsWith('src/')) {
          imports.push(moduleSpecifier);
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return imports;
  }

  function getLayerForPath(filePath: string): string | null {
    for (const [layer, paths] of Object.entries(layerMapping)) {
      for (const layerPath of paths) {
        if (filePath.includes(layerPath)) {
          return layer;
        }
      }
    }
    return null;
  }

  function getAllFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath, fileList);
      } else if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
        fileList.push(filePath);
      }
    });

    return fileList;
  }

  test('Core layer should not depend on outer layers', () => {
    const coreFiles = getAllFiles(path.join(srcPath, 'core'));

    coreFiles.forEach((file) => {
      const imports = getImports(file);
      const forbiddenImports = imports.filter(
        (imp) =>
          imp.includes('src/infrastructure') ||
          imp.includes('src/interface') ||
          imp.includes('src/application'),
      );

      expect(forbiddenImports).toEqual([]);
    });
  });

  test('Use cases should only depend on core', () => {
    const useCaseFiles: string[] = [];

    layerMapping.useCases.forEach((useCasePath) => {
      const fullPath = path.join(srcPath, useCasePath.replace('src/', ''));
      if (fs.existsSync(fullPath)) {
        useCaseFiles.push(...getAllFiles(fullPath));
      }
    });

    useCaseFiles.forEach((file) => {
      const imports = getImports(file);
      const forbiddenImports = imports.filter(
        (imp) =>
          imp.includes('src/infrastructure') || imp.includes('src/interface'),
      );

      if (forbiddenImports.length > 0) {
        console.warn(
          `File ${file} has forbidden dependencies: ${forbiddenImports.join(', ')}`,
        );
      }

      expect(forbiddenImports).toEqual([]);
    });
  });

  test('All layers should respect dependency rules', () => {
    const allFiles = getAllFiles(srcPath);
    const violations: { file: string; import: string }[] = [];

    allFiles.forEach((file) => {
      const sourceLayer = getLayerForPath(file);
      if (!sourceLayer) return;
      const imports = getImports(file);

      imports.forEach((importPath) => {
        const importLayer = getLayerForPath(importPath);
        if (!importLayer) return;

        const allowed: string[] =
          (allowedDependencies as Record<string, string[]>)[sourceLayer] || [];
        if (!allowed.includes(importLayer) && sourceLayer !== importLayer) {
          violations.push({
            file: file.replace(srcPath, 'src'),
            import: importPath,
          });
        }
      });
    });

    if (violations.length > 0) {
      console.error('Clean Architecture Violations:');
      violations.forEach((v) => {
        console.error(
          `${v.file} imports ${v.import} which violates dependency rules`,
        );
      });
    }

    expect(violations).toEqual([]);
  });

  test('Infrastructure should implement interfaces from core', () => {
    const implFiles = getAllFiles(path.join(srcPath, 'infrastructure')).filter(
      (file) => !file.includes('.interface.ts') && !file.includes('/types/'),
    );

    const implementsInterface = implFiles.filter((file) => {
      const content = fs.readFileSync(file, 'utf8');
      return (
        content.includes('implements') &&
        getImports(file).some((imp) => imp.includes('src/core/abstracts'))
      );
    });

    expect(implementsInterface.length).toBeGreaterThan(0);
  });

  test('Core entities should not have framework dependencies', () => {
    const entityFiles = getAllFiles(path.join(srcPath, 'core/entities'));

    entityFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf8');

      const hasFrameworkImports =
        content.includes("from '@nestjs") || content.includes("from '@prisma");

      expect(hasFrameworkImports).toBe(false);
    });
  });

  test('Interfaces in core should be implemented in infrastructure', () => {
    const interfaceFiles = getAllFiles(
      path.join(srcPath, 'core/abstracts'),
    ).filter((file) => file.includes('.interface.ts'));

    const interfaces = interfaceFiles
      .map((file) => {
        const content = fs.readFileSync(file, 'utf8');
        const matches = content.match(/export\s+interface\s+(\w+)/g) || [];
        return matches.map((m: string): string =>
          m.replace(/export\s+interface\s+/, ''),
        );
      })
      .flat();

    const infrastructureFiles = getAllFiles(
      path.join(srcPath, 'infrastructure'),
    );
    const implementedInterfaces = interfaces.filter((interfaceName) => {
      return infrastructureFiles.some((file) => {
        const content = fs.readFileSync(file, 'utf8');
        return content.includes(`implements ${interfaceName}`);
      });
    });

    expect(implementedInterfaces.length).toBeGreaterThan(0);
    expect(
      implementedInterfaces.length / interfaces.length,
    ).toBeGreaterThanOrEqual(0.5);
  });
});
