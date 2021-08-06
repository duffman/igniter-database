/*=--------------------------------------------------------------=
 Extended String Casing
 Author : Patrik Forsberg
 Web:   : http:/www.coldmind.com
 Email  : patrik.forsberg@coldmind.com
 GitHub : https://github.com/duffman

 I hope this piece of software brings joy into your life, makes
 you sleep better knowing that you are no longer have to scratch
 your head when it comes to converting strings from
 snake_casing to or from PascalCasing!
 String Helper for converting to and from Pascal, Snake and Dash ("kebab")
 casing, also contains helper methods for determining upper and lower
 case as well as lower and upper casing
 Use this software free of charge, the only thing I ask is that
 you obey to the terms stated in the license, i would also like
 you to keep the file header intact.
 Also, I would love to see you getting involved in the project!
 Enjoy!
 This software is subject to the MIT License, please find
 the full license attached in LICENCE.md
 =---------------------------------------------------------------=*/

let log = console.log;

enum CasingType {
	None,
	Snake,
	Dash,
	Pascal,
	Camel,
	Word,
}

export class StringCasing {
	static testLog(desc: string, value: string) {
		log(desc, value);
	}

	static testLogBool(desc: string, value: boolean) {
		let valueStr = value ? "true" : "false";
		log(desc, valueStr);
	}

	/**
	 * Check whether a string is assigned and has a length
	 * @param str
	 * @returns {boolean}
	 */
	public static validStr(str: any): boolean {
		return !((str === undefined) || (!str || 0 === str.length));
	}

	/**
	 * Determines if the given char is a letter
	 * @param char - char to executeNewRecord
	 * @returns
	 */
	public static isLetter(char: string): boolean {
		let firstChar = char.charAt(0).toUpperCase();
		return !(firstChar.toLowerCase() == firstChar);
	}

	/**
	 * Determines if a given string contains only letters
	 * @param str - string to
	 * @returns - wether a string is only letterrs
	 */
	public static onlyLetters(str: string): boolean {
		return (/^[a-zA-Z]+$/.test(str));
	}

	/**
	 * Returns the given string with first letter in upper case
	 * @param str - input string
	 * @returns - the resulting string
	 */
	public static upperFirst(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * Returns the given string with first letter in lower case
	 * @param str - input string
	 * @returns - resulting string
	 */
	public static lowerFirst(str: string) {
		return str.charAt(0).toLowerCase() + str.slice(1);
	}

	/**
	 * Detects if the first char of a given string is upper case
	 * @param str
	 */
	public static isFirstUpper(str: string): boolean {
		if (!StringCasing.validStr(str)) return false;
		return StringCasing.isUpperCase(str.charAt(0));
	}

	/**
	 * Detects if the first char of a given string is upper case
	 * @param str - input string
	 * @returns {boolean}
	 */
	public static isFirstLower(str: string): boolean {
		if (!StringCasing.validStr(str)) return false;
		return StringCasing.isLowerCase(str.charAt(0));
	}

	/**
	 * Determines if the given string is in lower case
	 * @param str - the string to executeNewRecord
	 * @returns - {boolean}
	 */
	public static isLowerCase(str: string): boolean {
		return !StringCasing.isUpperCase(str);
	}

	/**
	 * Determines if the given string is in upper case
	 * @param str - the string to executeNewRecord
	 * @returns {boolean}
	 */
	public static isUpperCase(str: string): boolean {
		return (str.toUpperCase() == str);
	}

	/**
	 * Checks whether a string contains an upper case
	 * @param str
	 * @returns {boolean}
	 */
	public static haveUpperCaseChar(str: string): boolean {
		let char: string = "";
		let result: boolean = false;

		for (let i = 0; i < str.length; i++) {
			char = str[i];
			if (StringCasing.isUpperCase(char)) {
				result = true;
				break;
			}
		}
		return result;
	}

	/**
	 * Semi-smart method to convert to and from Snake/Cane and Pascal casing
	 * and the other way around
	 * @param data - input string
	 * @param toLowerPascal - if set the result will be camel case
	 */
	public static invertCasing(data: string, toLowerPascal: boolean = false) {
		if (data.indexOf("_") > -1 || data.indexOf("-") > -1) {
			return StringCasing.snakeToPascalCase(data, toLowerPascal);
		}
		else {
			return StringCasing.pascalToSnakeCase(data);
		}
	}

	/**
	 * Processes a given string and replaces char which is not a valid letter with
	 * a given replacement char, only one fill char after an other will be included
	 *
	 *   Example with "-" as fill char:
	 *   Input: "#You___Could___  --> Be <-- Mine!!"
	 *   Output: "You-Could-Be-Mine
	 *
	 * @param data - input string
	 * @param fillChar -
	 * @returns - resulting string
	 */
	public static unifyString(data: string, fillChar: string = "_", stripNoneLetters: boolean = false): string {
		let prevChar: string = "";
		let currChar: string = "";
		let aheadChar: string = "";

		let chunk = "";

		for (let i = 0; i < data.length; i++) {
			let isFirstChar = (i == 0);
			prevChar = currChar;
			currChar = data[i];
			aheadChar = data[i + 1];

			if (!StringCasing.onlyLetters(currChar)) {
				currChar = fillChar;
				if (stripNoneLetters) continue;
			}

			if (prevChar == fillChar && currChar == fillChar) continue;

			chunk += currChar;
		}

		return chunk;
	}

	/**
	 * Base method for converting from pascal to snake/dash case
	 * @param data - input
	 * @param dashCase - if set output will be dash case
	 * @returns - resulting string
	 */
	public static convertFromPascalCasing(data: string, dashCase: boolean = false): string {
		if (data.length < 3) { return data.toLowerCase(); }
		let currChar = "";
		let aheadChar = "";

		let chunk = "";

		for (let i = 0; i < data.length; i++) {
			currChar = data[i];
			aheadChar = data[i + 1];

			if (i > 0 && StringCasing.isUpperCase(currChar)) {
				chunk += dashCase ? "-" : "_";
			}

			chunk += currChar;
		}

		return chunk.toLowerCase();
	}

	/**
	 * Converts Snake to Pascal case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static snakeToPascalCase(data: string, lowerPascal: boolean = false): string {
		let currChar = "";
		let aheadChar = "";

		let chunk = "";

		for (let i = 0; i < data.length; i++) {
			let isFirstChar = (i == 0);
			currChar = data[i];
			aheadChar = data[i + 1];

			if (isFirstChar) {
				chunk += lowerPascal ? currChar.toLowerCase() : currChar.toUpperCase();
				continue;
			}

			// Patrik: 2017-11-24 - added support for dash input
			if (currChar == "_" || currChar == "-") {
				chunk += StringCasing.validStr(aheadChar) ? aheadChar.toUpperCase() : "";
				i++;
				continue;
			}

			chunk += currChar;
		}

		return chunk;
	}

	/**
	 * Converts Snake to Camel case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static snakeToCamelCase(data: string): string {
		return StringCasing.snakeToPascalCase(data, true);
	}

	/**
	 * Converts Snake to Dash case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static snakeToDashCase(data: string): string {
		return StringCasing.unifyString(data, "-");
	}

	/**
	 * Converts Dash to Pascal case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static dashToPascalCase(data: string): string {
		return StringCasing.invertCasing(data);
	}

	/**
	 * Converts Dash to Camel case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static dashToCamelCase(data: string): string {
		return StringCasing.invertCasing(data, true);
	}

	/**
	 * Converts Dash to Snake case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static dashToSnakeCase(data: string): string {
		return StringCasing.unifyString(data, "_");
	}

	/**
	 * Converts Pascal to Snake case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static pascalToSnakeCase(data: string): string {
		return StringCasing.convertFromPascalCasing(data);
	}

	/**
	 * Converts Pascal to Dash case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static pascalToDashCase(data: string): string {
		return StringCasing.convertFromPascalCasing(data, true);
	}

	/**
	 * Converts Pascal to Camel case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static pascalToCamelCase(data: string): string {
		return StringCasing.lowerFirst(data);
	}

	/**
	 * Converts Camel to Pascal case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static camelToPascalCase(data: string): string {
		return StringCasing.upperFirst(data);
	}

	/**
	 * Converts Camel to Snake case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static camelToSnakeCase(data: string): string {
		return StringCasing.convertFromPascalCasing(data);
	}

	/**
	 * Converts Camel to Dash case
	 * @param data - string to convert
	 * @returns - converted string
	 */
	public static camelToDashCase(data: string): string {
		return StringCasing.convertFromPascalCasing(data);
	}

	/**
	 *
	 * @param - string to convert
	 * @returns - converted string
	 */
	public static toSnakeCase(data: string): string {
		data = StringCasing.unifyString(data, "_");
		return data.toLowerCase();
	}

	public static toDashCase(data: string): string {
		data = StringCasing.unifyString(data, "-");
		return data.toLowerCase();
	}

	public static toPascalCase(data: string, lowerFirst: boolean = false): string {
		if (!StringCasing.onlyLetters(data)) {
			data = StringCasing.unifyString(data);
		}

		if (!StringCasing.onlyLetters(data)) {
			data = StringCasing.unifyString(data);
			data = StringCasing.snakeToPascalCase(data, lowerFirst);
		} else {
			data = lowerFirst ? StringCasing.lowerFirst(data) : StringCasing.upperFirst(data);
		}

		return data;
	}

	public static toCamelCase(data: string): string {
		return StringCasing.toPascalCase(data, true);
	}

	public static test(): void {
		let snakeCase = "player_base_data_here_we_come";

		StringCasing.testLogBool("Is Letter 'A':", StringCasing.isLetter("A"));
		StringCasing.testLogBool("Is Letter '?':", StringCasing.isLetter("?"));

		StringCasing.testLogBool("Is UpperCase 'A':", StringCasing.isUpperCase("A"));
		StringCasing.testLogBool( "Is UpperCase 'a':", StringCasing.isUpperCase("a"));

		StringCasing.testLogBool( "Is LowerCase 'y':", StringCasing.isLowerCase("y"));
		StringCasing.testLogBool( "Is LowerCase 'Y':", StringCasing.isLowerCase("Y"));

		let tmp = snakeCase;

		console.log("------------");

		StringCasing.testLog("Snake:", snakeCase);
		let pascalCase = StringCasing.snakeToPascalCase(snakeCase);
		StringCasing.testLog("Snake to: Pascal:", pascalCase);

		tmp = StringCasing.snakeToPascalCase(snakeCase, true);
		StringCasing.testLog("Snake to: Lower Pascal:", tmp);

		console.log("------------");

		tmp = StringCasing.pascalToSnakeCase(pascalCase);
		StringCasing.testLog("Pascal to: Snake:", tmp);

		tmp = StringCasing.pascalToDashCase(pascalCase);
		StringCasing.testLog("Pascal to: Dash:", tmp);

		console.log("------------");

		tmp = StringCasing.invertCasing(pascalCase);
		StringCasing.testLog("Inverted from Pascal:", tmp);

		tmp = StringCasing.invertCasing(snakeCase);
		StringCasing.testLog("Inverted from Snake:", tmp);

		tmp = StringCasing.invertCasing(snakeCase, true);
		StringCasing.testLog("Inverted from Snake (lower flag):", tmp);

		StringCasing.testExperimental("OneStringToRuleThemAll")
	}

	public static testExperimental(data: string): void {
		console.log("toSnakeCase ::", StringCasing.toSnakeCase(data));
		console.log("toDashCase ::", StringCasing.toDashCase(data));
		console.log("toPascalCase ::", StringCasing.toPascalCase(data));
		console.log("toCameCase ::", StringCasing.toCamelCase(data));
	}
}
