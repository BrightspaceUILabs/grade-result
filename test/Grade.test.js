import { Grade, GradeErrors, GradeType } from '../src/controller/Grade.js';
import { assert } from '@open-wc/testing';

const letterGradeOptions = {
	0: {'LetterGrade': 'None', 'PercentStart': null},
	1: {'LetterGrade': 'A', 'PercentStart': '80'},
	2: {'LetterGrade': 'B', 'PercentStart': '65'},
	3: {'LetterGrade': 'C', 'PercentStart': '50'},
};

describe('Grade tests', () => {
	describe('properly calling constructor', () => {
		it('initializes properly for a numeric score', () => {
			const grade = new Grade(GradeType.Number, 10, 50, null, null);
			assert.equal(grade.isLetterGrade(), false);
			assert.equal(grade.isNumberGrade(), true);
			assert.equal(grade.getScoreType(), GradeType.Number);
			assert.equal(grade.getScore(), 10);
			assert.equal(grade.getScoreOutOf(), 50);
		});

		it('initializes properly for a letter score', () => {
			const grade = new Grade(GradeType.Letter, null, null, 'A', letterGradeOptions);
			assert.equal(grade.isLetterGrade(), true);
			assert.equal(grade.isNumberGrade(), false);
			assert.equal(grade.getScoreType(), GradeType.Letter);
			assert.equal(grade.getScore(), 1);
			assert.deepEqual(grade.getScoreOutOf(), letterGradeOptions);
		});
	});

	describe('throws an error if improper scoreType given in constructor', () => {
		it('given invalid string', () => {
			assert.throws(() => {
				new Grade('not valid', 10, 50, null, null);
			}, GradeErrors.INVALID_SCORE_TYPE);
		});

		it('given undefined', () => {
			assert.throws(() => {
				new Grade(undefined, 10, 50, null, null);
			}, GradeErrors.INVALID_SCORE_TYPE);
		});

		it('given number', () => {
			assert.throws(() => {
				new Grade(5, 10, 50, null, null);
			}, GradeErrors.INVALID_SCORE_TYPE);
		});

		it('given array', () => {
			assert.throws(() => {
				new Grade([], 10, 50, null, null);
			}, GradeErrors.INVALID_SCORE_TYPE);
		});
	});

	describe('ensures that the gradeType is case insensitive and isLetterGrade and isNumberGrade still work', () => {
		it('can handle numeric', () => {
			assert.doesNotThrow(() => {
				const grade = new Grade('numeric', 10, 50, null, null);
				assert.isFalse(grade.isLetterGrade());
				assert.isTrue(grade.isNumberGrade());
			});
		});

		it('can handle lettergrade', () => {
			assert.doesNotThrow(() => {
				const grade = new Grade('lettergrade', null, null, 'A', letterGradeOptions);
				assert.isTrue(grade.isLetterGrade());
				assert.isFalse(grade.isNumberGrade());
			});
		});
	});

	describe('throws an error if improper score/outOf are provided for numeric scores', () => {
		it('score as null', () => {
			assert.doesNotThrow(() => {
				new Grade(GradeType.Number, null, 10, null, null);
			});
		});

		it('score as string', () => {
			assert.throws(() => {
				new Grade(GradeType.Number, 'A', 10, null, null);
			}, GradeErrors.INVALID_SCORE);
		});

		it('score as array of strings', () => {
			assert.throws(() => {
				new Grade(GradeType.Number, ['A'], 10, null, null);
			}, GradeErrors.INVALID_SCORE);
		});

		it('outOf as null', () => {
			assert.throws(() => {
				new Grade(GradeType.Number, 5, null, null, null);
			}, GradeErrors.INVALID_OUT_OF);
		});

		it('outOf as string', () => {
			assert.throws(() => {
				new Grade(GradeType.Number, 5, 'B', null, null);
			}, GradeErrors.INVALID_OUT_OF);
		});

		it('outOf as array of strings', () => {
			assert.throws(() => {
				new Grade(GradeType.Number, 5, ['B'], null, null);
			}, GradeErrors.INVALID_OUT_OF);
		});

	});

	describe('throws an error if improper score/outOf are provided for letter scores', () => {
		it('lettergrade as null', () => {
			assert.doesNotThrow(() => {
				new Grade(GradeType.Letter, null, null, null, letterGradeOptions);
			});
		});

		it('lettergrade as number', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 10, letterGradeOptions);
			}, GradeErrors.INVALID_LETTER_GRADE);
		});

		it('lettergrade as array of strings', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, ['A', 'B'], letterGradeOptions);
			}, GradeErrors.INVALID_LETTER_GRADE);
		});

		it('lettergradeOptions as null', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 'A', null);
			}, GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		});

		it('lettergradeOptions as number', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 'A', 50);
			}, GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		});

		it('lettergradeOptions as string', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 'A', '50');
			}, GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		});

		it('lettergradeOptions as empty array', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 'A', []);
			}, GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		});

	});

	describe('getScore and getScoreOutOf work properly', () => {
		it('getScore works properly for numeric scores', () => {
			const grade = new Grade(GradeType.Number, 5, 10, null, null);
			assert.equal(grade.getScore(), 5);
		});

		it('getScore works properly for letter scores', () => {
			const grade = new Grade(GradeType.Letter, null, null, 'A', letterGradeOptions);
			assert.equal(grade.getScore(), 1);
		});

		it('getScoreOutOf works properly for numeric scores', () => {
			const grade = new Grade(GradeType.Number, 5, 10, null, null);
			assert.equal(grade.getScoreOutOf(), 10);
		});

		it('getScoreOutOf works properly for letter scores', () => {
			const grade = new Grade(GradeType.Letter, null, null, 'A', letterGradeOptions);
			assert.deepEqual(grade.getScoreOutOf(), letterGradeOptions);
		});
	});

	it('ensures that the letterGrade is one of the LetterGradeOptions', () => {
		assert.throws(() => {
			new Grade(GradeType.Letter, null, null, 'D', letterGradeOptions);
		}, GradeErrors.LETTER_GRADE_NOT_IN_OPTIONS);
	});

	it('allows score and outOf to be 0', () => {
		assert.doesNotThrow(() => {
			new Grade(GradeType.Number, 0, 0, null, null);
		});
	});

	describe('properly updates a score of a number grade', () => {
		const grade = new Grade(GradeType.Number, 0, 0, null, null);

		it('sets number grade score properly', () => {
			assert.doesNotThrow(() => {
				grade.setScore(10);
				assert.equal(grade.getScore(), 10);
			});
		});

		it('returns empty string for undefined score', () => {
			assert.doesNotThrow(() => {
				grade.setScore(undefined);
				assert.equal(grade.getScore(), '');
			});
		});

		it('does not throw for null score', () => {
			assert.doesNotThrow(() => {
				grade.setScore(null);
			});
		});

		it('throws error for string score', () => {
			assert.throws(() => {
				grade.setScore('A');
			}, GradeErrors.INVALID_SCORE);
		});

		it('throws error for array of strings score', () => {
			assert.throws(() => {
				grade.setScore(['A']);
			}, GradeErrors.INVALID_SCORE);
		});
	});

	it('properly updates a letter grade', () => {
		const grade = new Grade(GradeType.Letter, null, null, 'A', letterGradeOptions);

		it('sets the letter grade properly', () => {
			assert.doesNotThrow(() => {
				grade.setScore('B');
				assert.equal(grade.getScore(), 2);
			});
		});

		it('throws error for null score', () => {
			assert.doesNotThrow(() => {
				grade.setScore(null);
			});
		});

		it('throws error for undefined score', () => {
			assert.throws(() => {
				grade.setScore();
			}, GradeErrors.INVALID_LETTER_GRADE);
		});

		it('throws error for number score', () => {
			assert.throws(() => {
				grade.setScore(10);
			}, GradeErrors.INVALID_LETTER_GRADE);
		});

		it('throws error for array of strings score', () => {
			assert.throws(() => {
				grade.setScore(['A']);
			}, GradeErrors.INVALID_LETTER_GRADE);
		});

		it('throws error for new score not in letter grade options', () => {
			assert.throws(() => {
				grade.setScore('D');
			}, GradeErrors.LETTER_GRADE_NOT_IN_OPTIONS);
		});

	});

	it('is able to store and retrieve an entity associated with the grade', () => {
		const entity = { some: 'entity' };
		const grade = new Grade(GradeType.Number, 10, 11, null, null, entity);
		assert.equal(grade.getEntity(), entity);
	});

	describe('can handle when scores have not yet been set', () => {
		it('can handle score as null', () => {
			assert.doesNotThrow(() => {
				new Grade(GradeType.Number, null, 10, null, null);
			});
		});

		it('can handle letterGrade as null', () => {
			assert.doesNotThrow(() => {
				new Grade(GradeType.Letter, null, null, null, letterGradeOptions);
			});
		});
	});
});
