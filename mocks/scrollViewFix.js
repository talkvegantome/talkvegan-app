
// https://github.com/expo/expo/issues/2484
jest.mock("react-native/Libraries/Components/ScrollView/ScrollView", () =>
    jest.requireActual("react-native/Libraries/Components/ScrollView/__mocks__/ScrollViewMock")
);
