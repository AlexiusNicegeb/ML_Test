export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  CATEGORY_NAME_COMMA,
  CATEGORY_NAME_UPPER_LOWER_CASE,
} from "@/app/constants";
import { transformErrorCategories } from "@/app/helpers";
import type {
  GermanErrorCategoryDto,
  GermanErrorCategory,
  GermanError,
} from "@/app/models/german-errors";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { JsonValue } from "type-fest";

// export async function GET(request: NextRequest) {
//   try {
//     verifyAuth(request);
//   } catch (res: any) {
//     return res;
//   }

//   try {
//     type RawCategory = {
//       id: string;
//       name: string;
//       createdAt: Date;
//       parentId: string | null;
//       errors: JsonValue;
//     };

//     const rawCategories: RawCategory[] =
//       await prisma.germanErrorCategory.findMany({
//         select: {
//           id: true,
//           name: true,
//           createdAt: true,
//           parentId: true,
//           errors: true,
//         },
//         orderBy: { createdAt: "asc" },
//       });

//     const dtos: GermanErrorCategoryDto[] = rawCategories.map((c) => ({
//       id: c.id,
//       name: c.name,
//       createdAt: c.createdAt.getTime(),
//       parentId: c.parentId ?? undefined,
//       errors: Array.isArray(c.errors)
//         ? (c.errors as unknown as GermanError[])
//         : [],
//     }));

//     const tree = transformErrorCategories(dtos);

//     const filtered: GermanErrorCategory[] = [];
//     tree.forEach((root) => {
//       if (root.name.trim() === "Normative Sprachrichtigkeit") {
//         root.subCategories.forEach((level1) => {
//           if (level1.name.trim() === "Rechtschreibung") {
//             level1.subCategories.forEach((level2) => {
//               const nameTrim = level2.name.trim();
//               if (
//                 nameTrim === CATEGORY_NAME_UPPER_LOWER_CASE ||
//                 nameTrim === CATEGORY_NAME_COMMA
//               ) {
//                 filtered.push({
//                   ...level2,
//                   subCategories: level2.subCategories.filter(
//                     (sub) =>
//                       sub.errors.length > 0 &&
//                       sub.errors.some(
//                         (e) =>
//                           !!(
//                             (e as any).examples &&
//                             Array.isArray((e as any).examples) &&
//                             (e as any).examples.length > 0
//                           )
//                       )
//                   ),
//                 });
//               }
//             });
//           }
//         });
//       }
//     });

//     const result = filtered.filter((c) => c.subCategories.length > 0);
//     return NextResponse.json(result, { status: 200 });
//   } catch (err: any) {
//     console.error("GET /api/text-game Fehler:", err);
//     return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
//   }
// }
