import { App } from "./app";
import { Connection } from "./connections/db.connection";
import { collection } from "./utils/collection.utils";

const main = async () => {
  await Connection();
  await collection();
  const app = new App();
  await app.listen();
};

main();
