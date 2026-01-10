package domain

// Verdict Constants in the judging process
const (
	VerdictQueued  = "QUEUED"
	VerdictJudging = "JUDGING"
	VerdictAC      = "AC"  // Accepted
	VerdictWA      = "WA"  // Wrong Answer
	VerdictTLE     = "TLE" // Time Limit Exceeded
	VerdictMLE     = "MLE" // Memory Limit Exceeded
	VerdictRE      = "RE"  // Runtime Error
	VerdictCE      = "CE"  // Compilation Error
)

// Language constants
const (
	LangCPP    = "cpp"
	LangJs     = "js"
	LangTs     = "ts"
	LangPython = "python"
	LangJava   = "java"
	LangRust   = "rust"
	LangGo     = "go"
)

// Difficulty constants
const (
	DifficultyEasy   = "easy"
	DifficultyMedium = "medium"
	DifficultyHard   = "hard"
)

// Role constants
const (
	RoleUser      = "user"
	RoleAdmin     = "admin"
	RoleModerator = "moderator"
)
