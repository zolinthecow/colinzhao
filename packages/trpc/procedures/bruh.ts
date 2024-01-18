import { z } from "zod";
import { publicProcedure } from "../trpc";

const zInput = z.object({
  text: z.string(),
});

const bruh = publicProcedure.input(zInput).query(async (opts) => {
  const { input } = opts;

  console.log('bruh', input.text);

  return 'bruh ' + input.text;
});

export default bruh;
