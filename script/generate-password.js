import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the password to hash: ', async (password) => {
  // Generate a salt with cost factor 10
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password
  const hash = await bcrypt.hash(password, salt);
  
  console.log('\nPassword hash:');
  console.log(hash);
  console.log('\nAdd this to your .env file as AUTH_PASSWORD_HASH');
  
  rl.close();
});