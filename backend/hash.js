import bcrypt from 'bcryptjs';



bcrypt.hash("Ameerul94", 10).then((hash) => {
    console.log("Hashed Password:", hash);
});
