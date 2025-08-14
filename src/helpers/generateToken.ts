export function generateRandonToken (length: number = 6) {
  const chars = '0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return token;
};