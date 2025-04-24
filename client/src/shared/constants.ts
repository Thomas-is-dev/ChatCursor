/**
 * Constants and configurations for the chat server
 */

// List of unsafe words to block in usernames (strict list)
export const USERNAME_UNSAFE_WORDS = [
  // Administrative terms
  "admin",
  "administrator",
  "moderator",
  "mod",
  "system",
  "server",
  "root",
  "superuser",
  // Racial slurs (partial list - censored/abbreviated)
  "n-word",
  "nigger",
  "negro",
  "chink",
  "spic",
  "kike",
  "wetback",
  "gook",
  "coon",
  // Offensive terms
  "nazi",
  "hitler",
  "fascist",
  "racist",
  "sexist",
  "homophobe",
  "transphobe",
  // Vulgar/offensive terms
  "fuck",
  "shit",
  "bitch",
  "cunt",
  "asshole",
  "dick",
  "pussy",
  "whore",
  // Hate speech indicators
  "kill",
  "murder",
  "rape",
  "terrorist",
  "jihad",
  "holocaust",
  // Impersonation terms
  "official",
  "staff",
  "support",
  "helpdesk",
  "service",
  // Other terms
  "fack",
  "fvck",
  "fuk",
  "fucc",
  "phuck",
  "phuk",
  "feck",
  "fick",
  "sh1t",
  "shet",
  "shyt",
  "biatch",
  "b1tch",
  "bytch",
  "kunt",
  "cnut",
];

// List of words to filter in messages (only offensive content)
export const MESSAGE_BAD_WORDS = [
  // Racial slurs (partial list - censored/abbreviated)
  "n-word",
  "nigger",
  "negro",
  "chink",
  "spic",
  "kike",
  "wetback",
  "gook",
  "coon",
  // Offensive terms
  "nazi",
  "hitler",
  "fascist",
  "racist",
  "sexist",
  "homophobe",
  "transphobe",
  // Vulgar/offensive terms
  "fuck",
  "shit",
  "bitch",
  "cunt",
  "asshole",
  "dick",
  "pussy",
  "whore",
  "fack",
  "fvck",
  "fuk",
  "fucc",
  "phuck",
  "phuk",
  "feck",
  "fick",
  "sh1t",
  "shet",
  "shyt",
  "biatch",
  "b1tch",
  "bytch",
  "kunt",
  "cnut",
  // Hate speech indicators
  "kill",
  "murder",
  "rape",
  "terrorist",
  "jihad",
  "holocaust",

  // French vulgar terms
  "putain",
  "merde",
  "connard",
  "salope",
  "enculé",
  "con",
  "pute",
  "foutre",
  "branler",
  "niquer",
  // Spanish vulgar terms
  "puta",
  "mierda",
  "pendejo",
  "cabrón",
  "joder",
  "coño",
  "maricon",
  "chinga",
  "verga",
  "culo",
  // German vulgar terms
  "scheiße",
  "arschloch",
  "fotze",
  "hurensohn",
  "schwuchtel",
  "schwanz",
  "ficken",
  "wichser",
  // Italian vulgar terms
  "cazzo",
  "stronzo",
  "puttana",
  "merda",
  "figa",
  "troia",
  "vaffanculo",
  "minchia",
  // Portuguese vulgar terms
  "porra",
  "caralho",
  "foda",
  "puta",
  "buceta",
  "viado",
  "merda",
  "corno",
  // Russian vulgar terms (transliterated)
  "blyat",
  "suka",
  "pizda",
  "khuy",
  "yebat",
  "mudak",
  "pidor",
  "zalupa",
];

// Regex patterns for advanced username filtering
export const USERNAME_FILTER_PATTERNS: [RegExp, string][] = [
  // Admin variations (adm1n, @dmin, a_dmin, etc.)
  [
    /[aáàäâ@4]+[\s_\-\.]*[dḍḏ]+[\s_\-\.]*[mḿṁ]+[\s_\-\.]*[iíìïî1!|]+[\s_\-\.]*[nñń]+/gi,
    "admin",
  ],
  [/a[\W_]*d[\W_]*m[\W_]*i[\W_]*n/gi, "admin"],

  // Mod/Moderator variations
  [/[mḿṁ]+[\s_\-\.]*[oóòöô0ø€]+[\s_\-\.]*[dḍḏ]+/gi, "mod"],
  [/m[\W_]*o[\W_]*d/gi, "mod"],
  [
    /[mḿṁ]+[\s_\-\.]*[oóòöô0ø€]+[\s_\-\.]*[dḍḏ]+[\s_\-\.]*[eéèëê3]+[\s_\-\.]*[rŕṙ]+[\s_\-\.]*[aáàäâ@4]+[\s_\-\.]*[tṫ]+[\s_\-\.]*[oóòöô0ø€]+[\s_\-\.]*[rŕṙ]+/gi,
    "moderator",
  ],
  [/m[\W_]*o[\W_]*d[\W_]*e[\W_]*r[\W_]*a[\W_]*t[\W_]*o[\W_]*r/gi, "moderator"],

  // System variations (sy5tem, s-ystem, etc.)
  [
    /[sšśṡ5$]+[\s_\-\.]*[yýÿ]+[\s_\-\.]*[sšśṡ5$]+[\s_\-\.]*[tṫ]+[\s_\-\.]*[eéèëê3€]+[\s_\-\.]*[mḿṁ]+/gi,
    "system",
  ],
  [/s[\W_]*y[\W_]*s[\W_]*t[\W_]*e[\W_]*m/gi, "system"],

  // Root variations (r00t, ro_ot, etc.)
  [/[rŕṙ]+[\s_\-\.]*[oóòöô0ø€]{1,2}[\s_\-\.]*[tṫ]+/gi, "root"],
  [/r[\W_]*o[\W_]*o[\W_]*t/gi, "root"],

  // Server variations (s3rver, serv3r, etc.)
  [
    /[sšśṡ5$]+[\s_\-\.]*[eéèëê3€]+[\s_\-\.]*[rŕṙ]+[\s_\-\.]*[vṽ]+[\s_\-\.]*[eéèëê3€]+[\s_\-\.]*[rŕṙ]+/gi,
    "server",
  ],
  [/s[\W_]*e[\W_]*r[\W_]*v[\W_]*e[\W_]*r/gi, "server"],

  // Special euro symbol check for server
  [/s[\s_\-\.]*e[\s_\-\.]*r[\s_\-\.]*v[\s_\-\.]*[€e][\s_\-\.]*r/gi, "server"],

  // Also include offensive word patterns for usernames
  [/f[\W_]*[uúùüûµ][\W_]*c[\W_]*k/gi, "f***"],
  [/s[\W_]*h[\W_]*[iíìïî][\W_]*t/gi, "s***"],
  [/b[\W_]*[iíìïî][\W_]*t[\W_]*c[\W_]*h/gi, "b****"],
  [/c[\W_]*u[\W_]*n[\W_]*t/gi, "c***"],
  [/n[\W_]*[iíìïî][\W_]*g[\W_]*g[\W_]*[eéèëê][\W_]*r/gi, "n*****"],
];

// Define character sets for common substitutions
// const F_CHARS = ['f', 'ḟ', 'ph', 'ƒ'];
// const A_CHARS = ['a', 'á', 'à', 'ä', 'â', '@', '4', 'æ', 'ɑ'];
// const C_CHARS = ['c', 'ć', 'ç', 'k', 'ҝ', '('];
// const K_CHARS = ['k', 'ķ', 'қ', 'к', 'ҝ', 'ḱ'];
// const U_CHARS = ['u', 'ú', 'ù', 'ü', 'û', 'µ', 'v', 'w', '\\*', '\\^', '\\$', '\\%', '\\+', '\\&'];
// const I_CHARS = ['i', 'í', 'ì', 'ï', 'î', '1', '!', '\\|', '¡', '\\*', '\\^', 'y', 'ı'];
// const T_CHARS = ['t', 'ṫ', '7', '\\+'];
// const S_CHARS = ['s', 'š', 'ś', 'ṡ', '5', '\\$'];
// const H_CHARS = ['h', '#', '}{'];
// const B_CHARS = ['b', 'ƀ', 'ḃ', '8', '6'];
// const N_CHARS = ['n', 'ñ', 'ń', 'ņ'];
// const E_CHARS = ['e', 'é', 'è', 'ë', 'ê', '3', '€'];
// const G_CHARS = ['g', 'ǵ', 'ģ', 'ğ', '9', '6'];
// const R_CHARS = ['r', 'ŕ', 'ṙ', 'ɾ'];
// const O_CHARS = ['o', 'ó', 'ò', 'ö', 'ô', '0', 'ø', '\\(\\)', '\\[\\]'];
// const L_CHARS = ['l', '1', '\\|', 'ł', 'ĺ'];
// const P_CHARS = ['p', 'þ', 'ṗ', 'ƥ'];
// const Y_CHARS = ['y', 'ý', 'ÿ', 'ƴ'];
// const Z_CHARS = ['z', 'ž', '2'];
// const D_CHARS = ['d', 'ḍ', 'ḏ', 'đ'];
// const M_CHARS = ['m', 'ḿ', 'ṁ', 'ɱ'];
// const W_CHARS = ['w', 'vv', 'ŵ', '\\\\//'];

// Helper function to create regex alternatives for a character set
// const alt = (chars: string[]): string => `(?:${chars.join('|')})`;

// Helper function to create flexible regex pattern with optional separators
// const flexPattern = (parts: string[]): string => {
//   return parts.map(p => `${p}[\\s_\\-\\.\\*\\^\\$\\%\\+\\&\\?\\!\\|]*`).join('');
// };

// Regex patterns for offensive message content
export const MESSAGE_FILTER_PATTERNS: [RegExp, string][] = [
  // F-word - Super comprehensive pattern to catch ALL variations including hyphens
  [/f[-_\s]*[uüùûúūvw4\*\^@\-\s]*[cҫçćč¢kq\-\s]*[k†ḱḳḵ‡]/gi, "f***"],
  [/ph[-_\s]*[uüùûúūvw4\*\^@\-\s]*[cҫçćč¢kq\-\s]*[k†ḱḳḵ‡]/gi, "f***"],

  // F-word - Additional patterns for hyphenated variations
  [/f[-_\s.]*[uüùûúūvw4\*\^@][-_\s.]*[cҫçćč¢kq][-_\s.]*[k†ḱḳḵ‡]/gi, "f***"],
  [/f[-_\s.]*u[-_\s.]*c[-_\s.]*k/gi, "f***"],
  [/f[-_\s.]*v[-_\s.]*c[-_\s.]*k/gi, "f***"],
  [/f[-_\s.]*w[-_\s.]*c[-_\s.]*k/gi, "f***"],

  // F-word - Patterns for other common separators
  [
    /f[^a-zA-Z0-9]*[uüùûúūvw4\*\^@][^a-zA-Z0-9]*[cҫçćč¢kq][^a-zA-Z0-9]*k/gi,
    "f***",
  ],

  // F-word - Catch variations with any non-letter characters between
  [/f[^a-zA-Z]*u[^a-zA-Z]*c[^a-zA-Z]*k/gi, "f***"],
  [/f[^a-zA-Z]*v[^a-zA-Z]*c[^a-zA-Z]*k/gi, "f***"],
  [/f[^a-zA-Z]*w[^a-zA-Z]*c[^a-zA-Z]*k/gi, "f***"],

  // Racist variations (r@cist, rac1st, etc.)
  [
    /[rŕṙ]+[\s_\-\.]*[aáàäâ@4]+[\s_\-\.]*[cćç]+[\s_\-\.]*[iíìïî1!|]+[\s_\-\.]*[sšśṡ5$]+[\s_\-\.]*[tṫ]+/gi,
    "racist",
  ],

  // Nazi variations (n@zi, n4zi, n@z1, etc.)
  [/[nñń]+[\s_\-\.]*[aáàäâ@4]+[\s_\-\.]*[zž]+[\s_\-\.]*[iíìïî1!|]+/gi, "nazi"],
  // Additional variations specifically for "n@z1" and similar
  [/n[\W_]*[@aáàäâ4]+[\W_]*z[\W_]*[1iíìïî!|]+/gi, "nazi"],
  [/n[\W_]*[a4@]+[\W_]*[z3]+[\W_]*[i1!|]+/gi, "nazi"],

  // Slur variations
  [
    /[nñń]+[\s_\-\.]*[iíìïî1!|]+[\s_\-\.]*[gǵ]+[\s_\-\.]*[gǵ]+[\s_\-\.]*[eéèëê3€]+[\s_\-\.]*[rŕṙ]+/gi,
    "n*****",
  ],
  // Additional slur bypass variations
  [/n[\W_]*[i1!|]+[\W_]*g[\W_]*g[\W_]*[e3€]+[\W_]*r/gi, "n*****"],
  [/n[\W_]*[i1!|]+[\W_]*g[\W_]*[a4@]+/gi, "n***a"],

  // Additional variations with number and special character substitutions
  [/f[\W_]*[u\*vw\d]+[\W_]*c[\W_]*k/gi, "f***"],
  // Special character substitutions (f^ck, f$ck, f%ck, etc.)
  [/f[\W_]*[\^uúùüûµ\*vw\$%\d&]+[\W_]*c[\W_]*k/gi, "f***"],
  // More variations with leet speak
  [
    /f[^\s\w]*?(?:u|ü|v|\*|ú|ù|û|µ|\^|\$|%|\+|\d)[^\s\w]*?c[^\s\w]*?k/gi,
    "f***",
  ],
  // Cover ph substitution for f
  [/ph[\W_]*[uúùüûµ\*vw\^uúùüûµ\d\$%\+]+[\W_]*c[\W_]*k/gi, "f***"],

  // Enhanced diacritic-aware patterns to catch more bypasses
  [/f[\W_]*[uúùüûµ][\W_]*c[\W_]*k/gi, "f***"],
  [/s[\W_]*h[\W_]*[iíìïî][\W_]*t/gi, "s***"],
  [/b[\W_]*[iíìïî][\W_]*t[\W_]*c[\W_]*h/gi, "b****"],
  [/c[\W_]*u[\W_]*n[\W_]*t/gi, "c***"],
  [/n[\W_]*[iíìïî][\W_]*g[\W_]*g[\W_]*[eéèëê][\W_]*r/gi, "n*****"],
  [/p[\W_]*[uúùüûµ][\W_]*s[\W_]*s[\W_]*y/gi, "p***y"],
  [/d[\W_]*[iíìïî][\W_]*c[\W_]*k/gi, "d***"],
  [/a[\W_]*s[\W_]*s[\W_]*h[\W_]*[oóòöô][\W_]*l[\W_]*[eéèëê]/gi, "a******"],

  // Sh*t variations with special characters
  [/s[\W_]*[h#][\W_]*[i1!|¡\*\^][\W_]*[t7\+]/gi, "s***"],
  [/sh[\W_]*[i1!|¡\*\^][\W_]*t/gi, "s***"],
  [/sh[\W_]*[i1!|¡\*\^][\W_]*[t7\+]/gi, "s***"],

  // B*tch variations with special characters
  [/b[\W_]*[i1!|¡\*\^][\W_]*[t7\+][\W_]*c[\W_]*h/gi, "b****"],

  // C*nt variations with special characters
  [/c[\W_]*[uúùüûµ\*vw\^]+[\W_]*n[\W_]*[t7\+]/gi, "c***"],

  // A**hole variations with special characters
  [
    /a[\W_]*[s5\$]+[\W_]*[s5\$]+[\W_]*h[\W_]*[o0öôòó@]+[\W_]*l[\W_]*[e3€]+/gi,
    "a******",
  ],

  // French vulgar terms
  [/p[\W_]*u[\W_]*t[\W_]*a[\W_]*i[\W_]*n/gi, "p****n"],
  [/m[\W_]*e[\W_]*r[\W_]*d[\W_]*e/gi, "m***e"],
  [/c[\W_]*o[\W_]*n[\W_]*n[\W_]*a[\W_]*r[\W_]*d/gi, "c*****d"],
  [/s[\W_]*a[\W_]*l[\W_]*o[\W_]*p[\W_]*e/gi, "s****e"],
  [/e[\W_]*n[\W_]*c[\W_]*u[\W_]*l[\W_]*[eéèëê]/gi, "e****é"],
  [/n[\W_]*i[\W_]*q[\W_]*u[\W_]*e[\W_]*r/gi, "n****r"],

  // Spanish vulgar terms
  [/p[\W_]*u[\W_]*t[\W_]*a/gi, "p**a"],
  [/m[\W_]*i[\W_]*e[\W_]*r[\W_]*d[\W_]*a/gi, "m****a"],
  [/p[\W_]*e[\W_]*n[\W_]*d[\W_]*e[\W_]*j[\W_]*o/gi, "p*****o"],
  [/c[\W_]*a[\W_]*b[\W_]*r[\W_]*[oóòöô][\W_]*n/gi, "c****n"],
  [/j[\W_]*o[\W_]*d[\W_]*e[\W_]*r/gi, "j***r"],
  [/c[\W_]*o[\W_]*ñ[\W_]*o/gi, "c**o"],

  // German vulgar terms
  [/s[\W_]*c[\W_]*h[\W_]*e[\W_]*i[\W_]*[ßs][\W_]*e/gi, "s******e"],
  [/a[\W_]*r[\W_]*s[\W_]*c[\W_]*h[\W_]*l[\W_]*o[\W_]*c[\W_]*h/gi, "a********"],
  [/f[\W_]*o[\W_]*t[\W_]*z[\W_]*e/gi, "f***e"],
  [/f[\W_]*i[\W_]*c[\W_]*k[\W_]*e[\W_]*n/gi, "f****n"],

  // Italian vulgar terms
  [/c[\W_]*a[\W_]*z[\W_]*z[\W_]*o/gi, "c***o"],
  [/s[\W_]*t[\W_]*r[\W_]*o[\W_]*n[\W_]*z[\W_]*o/gi, "s*****o"],
  [
    /v[\W_]*a[\W_]*f[\W_]*f[\W_]*a[\W_]*n[\W_]*c[\W_]*u[\W_]*l[\W_]*o/gi,
    "v*********o",
  ],

  // Portuguese vulgar terms
  [/c[\W_]*a[\W_]*r[\W_]*a[\W_]*l[\W_]*h[\W_]*o/gi, "c******"],
  [/f[\W_]*o[\W_]*d[\W_]*a/gi, "f**a"],
  [/b[\W_]*u[\W_]*c[\W_]*e[\W_]*t[\W_]*a/gi, "b****a"],

  // Russian transliterated vulgar terms
  [/b[\W_]*l[\W_]*y[\W_]*a[\W_]*t/gi, "b***t"],
  [/s[\W_]*u[\W_]*k[\W_]*a/gi, "s**a"],
  [/p[\W_]*i[\W_]*z[\W_]*d[\W_]*a/gi, "p***a"],
  [/y[\W_]*e[\W_]*b[\W_]*a[\W_]*t/gi, "y***t"],
];
