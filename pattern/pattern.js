function generatePattern(N, T) {
  if (N < 1 || N > 26) {
    throw new Error("N must be between 1 and 26.");
  }

  let pattern = [];
  let sequence = [];

  // Function to generate alphabet or number sequence
  function generateSequence(startChar, count) {
    let sequence = [];
    for (let i = 0; i < count; i++) {
      sequence.push(String.fromCharCode(startChar.charCodeAt(0) + i));
    }
    return sequence.join('');
  }

  if (T === "a") {
    // Generate the alphabet sequence from 'a' to the Nth letter
    sequence = generateSequence("a", N);
    pattern.push(sequence);

    // Spaces at the middle of a row
    for (let i = 1; i < N - 1; i++) {
      pattern.push(sequence[i] + " ".repeat(N - 2) + sequence[N - i - 1]);
    }

    // Reverse of the alphabet sequence
    pattern.push(sequence.split("").reverse().join(''));
  } else if (T === "1") {
    // Number sequence from 1 to N
    for (let i = 1; i <= N; i++) {
      sequence.push(i);
    }
    sequence = sequence.join('');
    pattern.push(sequence);

    // Spaces at the middle of a row
    for (let i = 1; i < N - 1; i++) {
      pattern.push(sequence[i] + " ".repeat(N - 2) + sequence[N - i - 1]);
    }

    // Reverse of the number sequence
    pattern.push(sequence.split("").reverse().join(''));
  } else {
    throw new Error('Invalid value for T. Please use "a" or "1".');
  }

  return pattern.join('\n');
}

console.log(generatePattern(5, "a"));
console.log(generatePattern(7, "1"));
