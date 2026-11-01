import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';

import {
  getISOString,
  type ISOString,
  ISOStringSchema,
} from '#src/common/utils/date.utils.ts';


// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const IdSchema = z.uuidv7('Not a valid uuid7 id');

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Generate a uuid7 id.
 */
function genId(): string {
  return uuidv7();
}

/**
 * Test if an id is a valid id.
 */
function isId(val: unknown): val is string {
  return IdSchema.safeParse(val).success;
}


// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  genId,
  is: {
    id: isId,
  },
  Schemas: {
    Id: IdSchema,
  },
} as const;
