const fs = require('fs');

// Method to interpret a value depending on the specified base
function basedecoder(value, base) {
    return parseInt(value, base);
}

// Method to perform Lagrange interpolation and determine the constant term (c)
function lagrangeInterpolation(numbers) {
    let c = 0; // This will store the value of the constant term

    for (let i = 0; i < numbers.length; i++) {
        let [x_i, y_i] = numbers[i];
        let product = y_i; // Start with the y value

        for (let j = 0; j < numbers.length; j++) {
            if (i !== j) {
                let [x_j] = numbers[j];
                product *= x_j / (x_j - x_i); // Adjust the product
            }
        }

        c += product; // Accumulate the contribution to the constant term
    }

    return Math.round(c); // Return the rounded result
}

// Method to interpret the input and compute the constant term
function solvedequation(filename) {
    const content = fs.readFileSync(filename);
    const input = JSON.parse(content);

    const { n, k } = input.keys;
    let numbers = [];

    // Extract each root and save as (x, y) coordinates
    Object.keys(input).forEach(key => {
        if (!isNaN(key)) {
            const base = parseInt(input[key].base, 10);
            const value = input[key].value;
            const x = parseInt(key, 10);
            const y = basedecoder(value, base);

            numbers.push([x, y]);
        }
    });

    // Only use the first k numbers to solve the polynomial
    const requirednumbers = numbers.slice(0, k);

    // Calculate the constant term using Lagrange interpolation
    const constantTerm = lagrangeInterpolation(requirednumbers);

    console.log(`The secret constant term (c) is: ${constantTerm}`);
}

// Run the solver with the JSON test cases
solvedequation('testcase1.json');
solvedequation('testcase2.json');

