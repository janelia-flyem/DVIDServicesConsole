var DVIDServices = require("../../src/js/components/DVIDServices.react");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

// TODO: need to mock component function somehow (jasmine-react-helpers did not work previously)
describe("DVID Services", function () {
    it("asserts proper default services component initialization", function () {
        var component = TestUtils.renderIntoDocument(<DVIDServices service={"blah"} />);

        expect(component.props.service).toBe("blah");
        expect(component.state.services.length).toBe(0);
    });
});


