const assert = require("assert");
const path = require("path");

const { parseCmd } = require(path.join("..", "utils", "cmdParserUtils"));


describe("cmdParserUtils", () => {
    describe("#parseCmd", () => {
        it("should avoid dices format with other characters than '-', '+' or 'd'", () => {
            try {
                parseCmd("1db");
            } catch(err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("should not allow to not specify the number of dices to throw", () => {
            try {
                parseCmd("d10");
            } catch(err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("should work with spaces", () => {
            const res = parseCmd("       1d6 + 10      ");
            assert.deepEqual(res.dices, {6: 1});
            assert.equal(res.modifier, 10);
        });

        it("should not be space for the dice (1)", () => {
            try {
                parseCmd("1d 6");
            } catch(err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("should not be space for the dice (2)", () => {
            try {
                parseCmd("1 d6");
            } catch(err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("should work without spaces", () => {
            const res = parseCmd("1d6+10");
            assert.deepEqual(res.dices, {6: 1});
            assert.equal(res.modifier, 10);
        });

        it("cannot have +- expression", () => {
            try {
                parseCmd("1d6+-10");
            } catch(err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("cannot have -+ expression", () => {
            try {
                parseCmd("1d6-+10");
            } catch(err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });


        it("should work with many dices", () => {
            const res = parseCmd("1d6 1d8 7d12 3d6 +10 -12");
            assert.deepEqual(res.dices, {6: 4, 8: 1, 12: 7});
            assert.equal(res.modifier, -2);
        });
    });
});