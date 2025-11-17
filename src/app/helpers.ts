export const createBearerToken = (token: string) => `Bearer ${token}`;
export const getTokenOfBearer = (auth: string) => auth.split(" ")[1];
import arrayShuffle from "array-shuffle";
import { v4 } from "uuid";
import {
  GermanErrorCategory,
  GermanErrorCategoryDto,
} from "./models/german-errors";
import { FileData, FolderData } from "./types";

export const generateRandomString = (length = 7) => {
  const characters = arrayShuffle(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")
  );
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

export function findFolderById(
  folder: FolderData,
  id: string
): FolderData | undefined {
  if (folder.id === id) {
    return folder;
  }

  for (const subfolder of folder.subfolders) {
    const result = findFolderById(subfolder, id);
    if (result !== null) {
      return result;
    }
  }
}

export function replaceFolderById(
  folders: FolderData[],
  id: string,
  newFolder: FolderData
): boolean {
  for (let i = 0; i < folders.length; i++) {
    if (folders[i].id === id) {
      folders[i] = newFolder;
      return true;
    }

    if (replaceFolderById(folders[i].subfolders, id, newFolder)) {
      return true;
    }
  }
  return false;
}

export function findAllParents(
  folders: FolderData[],
  id: string,
  path: FolderData[] = []
): FolderData[] | null {
  for (const folder of folders) {
    const currentPath = [...path, folder];

    if (folder.id === id) {
      return currentPath.slice(0, -1);
    }

    const result = findAllParents(folder.subfolders, id, currentPath);
    if (result) {
      return result;
    }
  }

  return null;
}

export function buildFolderStructure(
  items: { name: string; url: string }[]
): FolderData[] {
  const root: FolderData[] = [];

  items.forEach((item) => {
    const parts = item.name.split("/");
    const fileName = parts.pop()!;
    let currentLevel = root;

    parts.forEach((part, index) => {
      let existingFolder = currentLevel.find((folder) => folder.name === part);

      if (!existingFolder) {
        existingFolder = {
          id: v4(),
          subfolders: [],
          files: [],
          name: part,
        };
        currentLevel.push(existingFolder);
      }

      if (index === parts.length - 1) {
        if (!existingFolder.files) {
          existingFolder.files = [];
        }
        if (!existingFolder.files.find((f) => f.name === fileName)) {
          existingFolder.files.push({
            id: v4(),
            name: fileName,
            path: item.name,
            url: item.url,
          });
        }
      } else {
        if (!existingFolder.subfolders) {
          existingFolder.subfolders = [];
        }
        currentLevel = existingFolder.subfolders;
      }
    });
  });

  return root;
}

export function flattenFoldersFiles(folders: FolderData[]): FileData[] {
  const flattened: FileData[][] = [];

  folders.forEach((folder) => {
    flattened.push(folder.files);

    if (folder.subfolders.length > 0) {
      const subfolders = flattenFoldersFiles(folder.subfolders);
      flattened.push(subfolders);
    }
  });

  return flattened.flat();
}

export const findFileById = (
  folder: FolderData,
  id: string
): FileData | undefined => {
  const file = folder.files.find((f) => f.id === id);
  if (file) {
    return file;
  } else {
    for (const subfolder of folder.subfolders) {
      const result = findFileById(subfolder, id);
      if (result) {
        return result;
      }
    }
  }
};

export const findFileByPath = (
  folder: FolderData,
  path: string
): FileData | undefined => {
  const file = folder.files.find((f) => f.path === path);
  if (file) {
    return file;
  } else {
    for (const subfolder of folder.subfolders) {
      const result = findFileByPath(subfolder, path);
      if (result) {
        return result;
      }
    }
  }
};

export function transformErrorCategories(
  dtos: GermanErrorCategoryDto[]
): GermanErrorCategory[] {
  const dtoMap = new Map<string, GermanErrorCategory>();
  const rootCategories: GermanErrorCategory[] = [];

  dtos.forEach((dto) => {
    dtoMap.set(dto.id, {
      id: dto.id,
      name: dto.name,
      createdAt: dto.createdAt,
      subCategories: [],
      errors: dto.errors || [],
    });
  });

  dtos.forEach((dto) => {
    const category = dtoMap.get(dto.id)!;

    if (dto.parentId) {
      const parentCategory = dtoMap.get(dto.parentId);
      if (parentCategory) {
        parentCategory.subCategories.push({
          ...category,
          parentId: dto.parentId,
        });
      }
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
}

/**
 * Converts a 2D Array to a Map in an Array (Mainly for Database use)
 *
 * @param   arr  The 2D-Array that should be converted to a Map in an Array.
 * @returns An Map in an Array. Indices are upwards counted starting by '0'.
 */
export function Array2dToMap(arr: Array<Array<any>>) {
  const retArray: Array<Map<string, string>> = [];
  arr.forEach((element) => {
    const localMap = new Map<string, string>();
    for (const i in element) {
      localMap.set(String(i), element[i]);
    }
    retArray.push(localMap);
  });
  return retArray;
}

export const formatPrice = (price: number) => {
  return (
    new Intl.NumberFormat("de-AT", {
      style: "currency",
      currency: "EUR",
    })
      .format(price)
      .replace(/€/, "")
      .trim() + " €"
  );
};

export const replaceUmlauts = (str: string) => {
  return str
    .replaceAll(/ü/g, "ue")
    .replaceAll(/ä/g, "ae")
    .replaceAll(/ö/g, "oe")
    .replaceAll(/Ü/g, "Ue")
    .replaceAll(/Ä/g, "Ae")
    .replaceAll(/Ö/g, "Oe");
};
