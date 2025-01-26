import * as cheerio from "npm:cheerio";

const INPUT_FILE_PATH = "/Users/dror/Downloads/תנועות בחשבון 26_1_2025-1.html";
const OUTPATH = "/Users/dror/Downloads/leumi_output.csv";

const inputFile = await Deno.readTextFile(INPUT_FILE_PATH);
using outputFile = await Deno.create(OUTPATH);
async function writeToFile(s: string): Promise<void> {
  const enc = new TextEncoder();
  const sb = enc.encode(s);
  await outputFile.write(sb);
}
await writeToFile("Date,Description,Asmachta,Paid,Got,Total,Comment\n");

const $ = cheerio.load(inputFile);

const tbl = $(".ts-table");
const rows = tbl.find(".order-items > .history-item > div > .ts-table-row");

for (let i = 0; i < rows.length; ++i) {
  // for (let i = 0; i < 5; ++i) {

  const row = rows[i];
  // console.log($(row).text().replaceAll("\n", " "));

  const cols = $(row).find(".ts-table-row-item");
  for (let j = 0; j < cols.length; ++j) {
    console.log("j=", j, ";", $(cols[j]).text().trim());
    if (j == 0) {
      // duplicate data column
      continue;
    }

    const col = cols[j];
    const txt = $(col).text().trim();
    if (txt.length == 0) {
      continue;
    }
    await writeToFile('"' + txt + '"');
    // if (j < cols.length - 1) {
    await writeToFile(",");
    // }
  }
  await writeToFile("\n");
}
