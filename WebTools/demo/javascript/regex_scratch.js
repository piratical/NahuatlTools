
const atom_cons=['m','n','p','t','k','κ','τ','λ','ς','s','l','x','h','y','w'];
const sep_cons=['m','n','p','t','k','ku','ts','tl','ch','s','l','x','j','y','u'];

const pref = 'o?(xi|ni|ti|in)?(nech|mits|tech|mech|kin|ki|k)?(on|hual)?(mo)?(tla|te)?([a-z]+)?';
const verb = '(itta)';
const sufi = '(ti|ki|to|ko|yaya|ya|ke|skia|ske|se|s|kan|k)?h?';

// MM 40
// keMMan group: 15 axcanah tlach
const mm1 = {fr:'keman',to:'kemman',re:/(ax|kej|san)?keman(ueli|iuki|tika|tsin|ya)?/};
// semm group: 16 tlach
const mm2 = {fr:'sem',to:'semm',re:/(kuatsonkal|tsonkal|kua|tla)?semm(aka|ana|aniui|ani|ijyokui|oyakti|oyauilia|oyaui|oyaua)/;
// nexkommana group: 2 tlach
const mm3 = {fr:'koman',to:'komman',re:/nexkomman(nilia|na)/};
// everything else:
const mm4 = {fr:'kemach',to:'kemmach',re:/\bkemmach\b/};
const mm5 = {fr:'ama',to:'amma',re:/\batlammaxalli\b/;
// NN 73
// tenno group: 23
const nn1 = {fr:'teno',to:'tenno',re:/tenno\b/}

