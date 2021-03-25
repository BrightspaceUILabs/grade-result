
export const GradeType = {
	Letter: 'LetterGrade',
	Number: 'Numeric'
};

export const GradeErrors = {
	INVALID_SCORE_TYPE: 'Invalid scoreType provided',
	INVALID_SCORE: 'Invalid score provided',
	INVALID_OUT_OF: 'Invalid outOf provided',
	INVALID_LETTER_GRADE: 'Invalid letterGrade provided',
	INVALID_LETTER_GRADE_OPTIONS: 'Invalid letterGradeOptions provided',
	LETTER_GRADE_NOT_IN_OPTIONS: 'letterGrade must be one of the letterGradeOptions provided'
};

export class Grade {
	constructor(scoreType, score, outOf, letterGrade, letterGradeOptions, entity) {
		this.entity = entity;
		this.scoreType = this._parseScoreType(scoreType);
		if (this.isNumberGrade()) {
			this._parseNumberGrade(score, outOf);
		} else {
			this._parseLetterGrade(letterGrade, letterGradeOptions);
		}
	}

	_parseScoreType(scoreType) {
		const invalidScoreError = new Error(GradeErrors.INVALID_SCORE_TYPE);

		if (!scoreType || typeof scoreType !== 'string') {
			throw invalidScoreError;
		}

		if (scoreType.toLowerCase() === GradeType.Number.toLowerCase()) {
			return GradeType.Number;
		} else if (scoreType.toLowerCase() === GradeType.Letter.toLowerCase()) {
			return GradeType.Letter;
		} else {
			throw invalidScoreError;
		}
	}

	_parseNumberGrade(score, outOf) {
		if ((!outOf || isNaN(outOf)) && outOf !== 0) {
			throw new Error(GradeErrors.INVALID_OUT_OF);
		}

		if (score === undefined) {
			score = '';
		} else if (isNaN(score)) {
			throw new Error(GradeErrors.INVALID_SCORE);
		} else if (typeof score === 'string') {
			score = Number(score);
		}

		if (typeof outOf === 'string') {
			outOf = Number(outOf);
		}

		this.score = score;
		this.outOf = outOf;
		this.letterGrade = null;
		this.letterGradeOptions = null;
	}

	_parseLetterGrade(letterGrade, letterGradeOptions) {
		if ((!letterGrade || typeof letterGrade !== 'string') && letterGrade !== null) {
			throw new Error(GradeErrors.INVALID_LETTER_GRADE);
		}

		if (!letterGradeOptions || !Array.isArray(letterGradeOptions) || letterGradeOptions.length === 0) {
			throw new Error(GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		}

		if (letterGrade !== null && !letterGradeOptions.includes(letterGrade)) {
			throw new Error(GradeErrors.LETTER_GRADE_NOT_IN_OPTIONS);
		}

		this.score = null;
		this.outOf = null;
		this.letterGrade = letterGrade;
		this.letterGradeOptions = letterGradeOptions;
	}

	isLetterGrade() {
		return this.scoreType === GradeType.Letter;
	}

	isNumberGrade() {
		return this.scoreType === GradeType.Number;
	}

	getScoreType() {
		return this.scoreType;
	}

	getScore() {
		return this.isNumberGrade() ? this.score : this.letterGrade;
	}

	getScoreOutOf() {
		return this.isNumberGrade() ? this.outOf : this.letterGradeOptions;
	}

	setScore(score) {
		if (this.isNumberGrade()) {
			this._parseNumberGrade(score, this.outOf);
		} else {
			this._parseLetterGrade(score, this.letterGradeOptions);
		}
	}

	getEntity() {
		return this.entity;
	}
}
