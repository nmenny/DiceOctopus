/**
 * OctoDice
 * Copyright (C) 2024  Nathan Menny
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const assert = require("assert");
const path = require("path");

const { parseCmd } = require(path.join("..", "utils", "cmdParserUtils"));


describe("cmdParserUtils", () => {
    describe("#parseCmd", () => {
        it("should avoid dices format with other characters than '-', '+' or 'd'", () => {
            try {
                parseCmd("1db");
            } catch (err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("should not allow to not specify the number of dices to throw", () => {
            try {
                parseCmd("d10");
            } catch (err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("must throw at least one dice", () => {
            try {
                parseCmd("+3");
            } catch (err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("cannot throw zero dice", () => {
            try {
                parseCmd("0d100");
            } catch (err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("should work with spaces", () => {
            const res = parseCmd("       1d6 + 10      ");
            assert.deepEqual(res.dices, { 6: 1 });
            assert.equal(res.modifier, 10);
        });

        it("should not be space for the dice (1)", () => {
            try {
                parseCmd("1d 6");
            } catch (err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("should not be space for the dice (2)", () => {
            try {
                parseCmd("1 d6");
            } catch (err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("should work without spaces", () => {
            const res = parseCmd("1d6+10");
            assert.deepEqual(res.dices, { 6: 1 });
            assert.equal(res.modifier, 10);
        });

        it("cannot have +- expression", () => {
            try {
                parseCmd("1d6+-10");
            } catch (err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });

        it("cannot have -+ expression", () => {
            try {
                parseCmd("1d6-+10");
            } catch (err) {
                assert.ok(true);
                return;
            }

            assert.fail();
        });


        it("should work with many dices", () => {
            const res = parseCmd("1d6 1d8 7d12 3d6 +10 -12");
            assert.deepEqual(res.dices, { 6: 4, 8: 1, 12: 7 });
            assert.equal(res.modifier, -2);
        });
    });
});