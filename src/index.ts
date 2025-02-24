import fs from 'fs';
import path from 'path';

// const args = process.argv.slice(2);
// const isV5 = args.includes('--v5');
const typesDir = '_types';
const v5Dir = path.join(__dirname, '/v5');

if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir);
console.log('v5 files:', v5Dir);
try {
    const v5Files = fs.readdirSync(v5Dir);
    console.log('v5 files:', v5Files);
    v5Files.forEach((file) => {
        const fileName = path.parse(file).name;
        const fileContent = fs.readFileSync(path.join(v5Dir, file), 'utf-8');
        writeFile(path.join(typesDir, `${fileName}.ts`), fileContent);
    });
} catch (error) {
    console.error('Error generating types from v5 folder:', error);
}

function writeFile(filePath: string, content: string) {
    try {
        fs.writeFileSync(filePath, content);
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
    }
}

// // stop here
// return;
// let apiFolders: string[];
// try {
//   apiFolders = fs.readdirSync("./src/api").filter((x) => !x.startsWith("."));
// } catch (e) {
//   console.log("No API types found. Skipping...");
// }

// if (apiFolders)
//   for (const apiFolder of apiFolders) {
//     const interfaceName = pascalCase(apiFolder);
//     const interfaceContent = createInterface(
//       `./src/api/${apiFolder}/content-types/${apiFolder}/schema.json`,
//       interfaceName,
//       isV5
//     );
//     if (interfaceContent)
//       fs.writeFileSync(`${typesDir}/${interfaceName}.ts`, interfaceContent);
//   }

// // --------------------------------------------
// // Components
// // --------------------------------------------

// let componentCategoryFolders: string[];
// try {
//   componentCategoryFolders = fs.readdirSync("./src/components");
// } catch (e) {
//   console.log("No Component types found. Skipping...");
// }

// if (componentCategoryFolders) {
//   const targetFolder = "types/components";

//   if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder);

//   for (const componentCategoryFolder of componentCategoryFolders) {
//     const componentSchemas = fs.readdirSync(
//       `./src/components/${componentCategoryFolder}`
//     );
//     for (const componentSchema of componentSchemas) {
//       const interfaceName = pascalCase(componentSchema.replace(".json", ""));
//       const interfaceContent = createComponentInterface(
//         `./src/components/${componentCategoryFolder}/${componentSchema}`,
//         interfaceName,
//         isV5
//       );
//       if (interfaceContent)
//         fs.writeFileSync(
//           `${targetFolder}/${interfaceName}.ts`,
//           interfaceContent
//         );
//     }
//   }
// }

// // --------------------------------------------
// // API Routes
// // --------------------------------------------
// const routesDir = "types/routes";

// if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir);

// if (apiFolders) {
//   const routes = apiFolders.map((apiFolder) => {
//     const schemaPath = `./src/api/${apiFolder}/content-types/${apiFolder}/schema.json`;
//     const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
//     const routeName = pascalCase(apiFolder);
//     const name =
//       schema.kind === "collectionType"
//         ? schema.info.pluralName
//         : schema.info.singularName;

//     return { routeName, name, kind: schema.kind };
//   });

//   const sortedRoutes = routes.sort((a, b) => {
//     if (a.kind === b.kind) return a.name.localeCompare(b.name);
//     return a.kind === "collectionType" ? -1 : 1;
//   });

//   const collections = sortedRoutes
//     .filter((route) => route.kind === "collectionType")
//     .map((route) => `${route.routeName} = "${route.name}"`)
//     .join(",\n");

//   const singleTypes = sortedRoutes
//     .filter((route) => route.kind === "singleType")
//     .map((route) => `${route.routeName} = "${route.name}"`)
//     .join(",\n");

//   const routesEnum = `export enum StrapiRoute {
//     /* collections */
//     ${collections},

//     /* singleTypes */
//     ${singleTypes}
//     }`;

//   fs.writeFileSync(`${routesDir}/StrapiRoute.ts`, routesEnum);
// }
