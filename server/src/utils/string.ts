/**
 * Hides part of an email address for privacy
 * Example: admin@gmail.com => ad***@gm***
 *
 * @param email - The email address to mask
 * @param visibleChars - Number of characters to show at beginning of each part (default: 2)
 * @returns The masked email
 */
export const hideEmail = (email: string, visibleChars = 2): string => {
  if (!email || !email.includes('@')) {
    return email
  }
  const [username, domain] = email.split('@')
  const maskedUsername = username.length <= visibleChars ? username : `${username.substring(0, visibleChars)}***`
  const maskedDomain = domain.length <= visibleChars ? domain : `${domain.substring(0, visibleChars)}***`
  return `${maskedUsername}@${maskedDomain}`
}
