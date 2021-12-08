import { CreateApp } from "@root/__test__/utils/createApp";

const createApp = new CreateApp();

describe("Health Check API", () => {
  let app: CreateApp["app"];

  beforeAll(async () => {
    await createApp.initServer();
    app = createApp.app;
  });

  afterAll(async () => {
    await createApp.stopServer();
  });

  it("Should hit health check API", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health-check",
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      status: "OK",
    });
  });
});
