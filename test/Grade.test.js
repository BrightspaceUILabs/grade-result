import { Grade, GradeType } from '../src/controller/Grade.js';
import { assert } from '@open-wc/testing';

describe('Grade class tests', () => {
	it('initializes properly for a numeric score', () => {
		const grade = new Grade(GradeType.Number, 10, 50, null, null);
		assert.equal(grade.scoreType, GradeType.Number);
		assert.equal(grade.score, 10);
		assert.equal(grade.outOf, 50);
		assert.equal(grade.letterGrade, null);
		assert.equal(grade.letterGradeOptions, null);
	});

	it('initializes properly for a letter score', () => {
		const grade = new Grade(GradeType.Letter, null, null, 'A', ['A', 'B', 'C']);
		assert.equal(grade.scoreType, GradeType.Letter);
		assert.equal(grade.score, null);
		assert.equal(grade.outOf, null);
		assert.equal(grade.letterGrade, 'A');
		assert.deepEqual(grade.letterGradeOptions, ['A', 'B', 'C']);
	});

	it('throws an error if improper scoreType given in constructor', () => {
		assert.throws(() => {
			new Grade('not valid', 10, 50, null, null);
		}, 'Invalid scoreType given');

		assert.throws(() => {
			new Grade(undefined, 10, 50, null, null);
		}, 'Invalid scoreType given');

		assert.throws(() => {
			new Grade(5, 10, 50, null, null);
		}, 'Invalid scoreType given');

		assert.throws(() => {
			new Grade([], 10, 50, null, null);
		}, 'Invalid scoreType given');
	});

	it('ensures that the gradeType is case insensitive and isLetterGrade and isNumberGrade still work', () => {
		assert.doesNotThrow(() => {
			const grade = new Grade('numeric', 10, 50, null, null);
			assert.isFalse(grade.isLetterGrade());
			assert.isTrue(grade.isNumberGrade());
		});

		assert.doesNotThrow(() => {
			const grade = new Grade('lettergrade', null, null, 'A', ['A', 'B', 'C']);
			assert.isTrue(grade.isLetterGrade());
			assert.isFalse(grade.isNumberGrade());
		});
	});

	it('throws an error if improper score/outOf are provided for numeric scores', () => {
		assert.throws(() => {
			new Grade(GradeType.Number, null, 10, null, null);
		}, 'Invalid score provided');

		assert.throws(() => {
			new Grade(GradeType.Number, 'A', 10, null, null);
		}, 'Invalid score provided');

		assert.throws(() => {
			new Grade(GradeType.Number, ['A'], 10, null, null);
		}, 'Invalid score provided');

		assert.throws(() => {
			new Grade(GradeType.Number, 5, null, null, null);
		}, 'Invalid outOf provided');

		assert.throws(() => {
			new Grade(GradeType.Number, 5, 'B', null, null);
		}, 'Invalid outOf provided');

		assert.throws(() => {
			new Grade(GradeType.Number, 5, ['B'], null, null);
		}, 'Invalid outOf provided');
	});

	it('throws an error if improper score/outOf are provided for letter scores', () => {
		assert.throws(() => {
			new Grade(GradeType.Letter, null, null, null, ['A', 'B', 'C']);
		}, 'Invalid letterGrade provided');

		assert.throws(() => {
			new Grade(GradeType.Letter, null, null, 10, ['A', 'B', 'C']);
		}, 'Invalid letterGrade provided');

		assert.throws(() => {
			new Grade(GradeType.Letter, null, null, ['A', 'B'], ['A', 'B', 'C']);
		}, 'Invalid letterGrade provided');

		assert.throws(() => {
			new Grade(GradeType.Letter, null, null, 'A', null);
		}, 'Invalid letterGradeOptions provided');

		assert.throws(() => {
			new Grade(GradeType.Letter, null, null, 'A', []);
		}, 'Invalid letterGradeOptions provided');

		assert.throws(() => {
			new Grade(GradeType.Letter, null, null, 'A', 50);
		}, 'Invalid letterGradeOptions provided');
	});

	it('isNumberGrade and getScoreType works properly', () => {
		const grade = new Grade(GradeType.Number, 5, 10, null, null);
		assert.equal(grade.isLetterGrade(), false);
		assert.equal(grade.isNumberGrade(), true);
		assert.equal(grade.getScoreType(), GradeType.Number);
	});

	it('isLetterGrade and getScoreType works properly', () => {
		const grade = new Grade(GradeType.Letter, null, null, 'A', ['A', 'B', 'C']);
		assert.equal(grade.isLetterGrade(), true);
		assert.equal(grade.isNumberGrade(), false);
		assert.equal(grade.getScoreType(), GradeType.Letter);
	});

	it('getScore works properly for numeric scores', () => {
		const grade = new Grade(GradeType.Number, 5, 10, null, null);
		assert.equal(grade.getScore(), 5);
	});

	it('getScore works properly for letter scores', () => {
		const grade = new Grade(GradeType.Letter, null, null, 'A', ['A', 'B', 'C']);
		assert.equal(grade.getScore(), 'A');
	});

	it('getScoreOutOf works properly for numeric scores', () => {
		const grade = new Grade(GradeType.Number, 5, 10, null, null);
		assert.equal(grade.getScoreOutOf(), 10);
	});

	it('getScoreOutOf works properly for letter scores', () => {
		const grade = new Grade(GradeType.Letter, null, null, 'A', ['A', 'B', 'C']);
		assert.deepEqual(grade.getScoreOutOf(), ['A', 'B', 'C']);
	});

	it('ensures that the letterGrade is one of the LetterGradeOptions', () => {
		assert.throws(() => {
			new Grade(GradeType.Letter, null, null, 'A', ['B', 'C']);
		}, 'letterGrade must be one of the letterGradeOptions provided');
	});

	it('allows score and outOf to be 0', () => {
		assert.doesNotThrow(() => {
			new Grade(GradeType.Number, 0, 0, null, null);
		});
	});

	it('properly updates a score of a number grade', () => {
		const grade = new Grade(GradeType.Number, 0, 0, null, null);

		assert.doesNotThrow(() => {
			grade.setScore(10);
			assert.equal(grade.getScore(), 10);
		});

		assert.throws(() => {
			grade.setScore(null);
		}, 'Invalid score provided');

		assert.throws(() => {
			grade.setScore('A');
		}, 'Invalid score provided');

		assert.throws(() => {
			grade.setScore(['A']);
		}, 'Invalid score provided');
	});

	it('properly updates a letter grade', () => {
		const grade = new Grade(GradeType.Letter, null, null, 'A', ['A', 'B', 'C']);

		assert.doesNotThrow(() => {
			grade.setScore('B');
			assert.equal(grade.getScore(), 'B');
		});

		assert.throws(() => {
			grade.setScore(null);
		}, 'Invalid letterGrade provided');

		assert.throws(() => {
			grade.setScore();
		}, 'Invalid letterGrade provided');

		assert.throws(() => {
			grade.setScore(10);
		}, 'Invalid letterGrade provided');

		assert.throws(() => {
			grade.setScore(['A']);
		}, 'Invalid letterGrade provided');

		assert.throws(() => {
			grade.setScore('D');
		}, 'letterGrade must be one of the letterGradeOptions provided');
	});

	it('is able to store and retrieve an entity associated with the grade', () => {
		const entity = { some: 'entity' };
		const grade = new Grade(GradeType.Number, 10, 11, null, null, entity);
		assert.equal(grade.getEntity(), entity);
	});
});
