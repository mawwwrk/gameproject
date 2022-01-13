import { dispObj } from "../src/classes";
describe("instances of the displayObject class", () => {
  let testDispObj;
  beforeAll(() => {
    testDispObj = new dispObj();
  });

  it("has x, y, width, and height properties", () => {
    ["x", "y", "width", "height"].map((prop) =>
      expect(testDispObj).toHaveProperty(prop)
    );
  });
  it("can return a position object", () => {
    expect(testDispObj.position).toMatchObject({
      x: testDispObj.x,
      y: testDispObj.y,
    });
  });
  it("has helper methods that returns its halfwidth and halfheight", () => {
    expect(testDispObj.halfWidth).toEqual(testDispObj.width / 2);
    expect(testDispObj.halfHeight).toEqual(testDispObj.width / 2);
  });
});
