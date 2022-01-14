import { DisplayObj } from "../src/classes/dispObj";
jest.mock("../src/classes/dispObj");

beforeEach(() => {
  DisplayObj.mockClear();
});

test("That the constructor is called when we do new DisplayObj", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const objectToDisplay = new DisplayObj();
  expect(DisplayObj).toHaveBeenCalledTimes(1);
});

test("that the reset is running before each test", () => {
  expect(DisplayObj).not.toHaveBeenCalled();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const objectToDisplay = new DisplayObj();
  expect(DisplayObj).toHaveBeenCalledTimes(1);
});

describe("the functionality of the private circular property", () => {
  let objectToDisplay: DisplayObj;
  beforeEach(() => {
    objectToDisplay = new DisplayObj();
  });

  it("circular property should be false by default", () => {
    expect(objectToDisplay.circular).toBeFalsy();
  });

  it("should not have diameter and radius properties", () => {
    expect(objectToDisplay).not.toHaveProperty("diameter");
    expect(objectToDisplay).not.toHaveProperty("radius");
  });

  test("height and width are independent", () => {
    objectToDisplay.height = 200;
    objectToDisplay.width = 20;
    expect(objectToDisplay.height).not.toEqual(objectToDisplay.width);
  });

  test("circular property can be turned on", () => {
    objectToDisplay.circular = true;
    expect(objectToDisplay.circular).toBeTruthy();
  });
  it("should have radius and diameter properties", () => {
    objectToDisplay.circular = true;
    expect(objectToDisplay.diameter).toBeDefined();
    expect(objectToDisplay.radius).toBeDefined();
  });
});
