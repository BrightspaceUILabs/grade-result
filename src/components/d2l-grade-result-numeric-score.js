import '@brightspace-ui/core/components/inputs/input-number';
import { bodyStandardStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { LocalizeGradeResult } from '../../localize-grade-result.js';

export class D2LGradeResultNumericScore extends LocalizeGradeResult(LitElement) {
	static get properties() {
		return {
			scoreNumerator: { type: Number },
			scoreDenominator: { type: Number },
			readOnly: { type: Boolean }
		};
	}

	static get styles() {
		return [bodyStandardStyles, labelStyles, inputLabelStyles, css`
			.d2l-grade-result-numeric-score-container {
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			.d2l-grade-result-numeric-score-score {
				max-width: 5.25rem;
			}
			.d2l-grade-result-numeric-score-score-read-only {
				max-width: 5.25rem;
				margin-right: 0.5rem;
			}
			.d2l-grade-result-numeric-score-score-text {
				margin-left: 0.5rem;
				margin-right: 0.25rem;
				text-align: center;
			}
			:host([dir="rtl"]) .d2l-grade-result-numeric-score-score-read-only {
				margin-left: 0.5rem;
				margin-right: 0rem;
			}
			:host([dir="rtl"]) .d2l-grade-result-numeric-score-score-text {
				margin-right: 0.5rem;
				margin-left: 0.25rem;
			}
		`];
	}

	_onGradeChange(e) {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-change', {
			bubbles: true,
			composed: true,
			detail: {
				value: e.target.value
			}
		}));
	}

	render() {
		let inputNumberLabel;
		if (!this.scoreDenominator) {
			inputNumberLabel = this.localize('GradeScoreLabel', { numerator: this.scoreNumerator || 'blank' });
		} else {
			inputNumberLabel = this.localize('fullGradeScoreLabel', { numerator: this.scoreNumerator || 'blank', denominator: this.scoreDenominator });
		}
		return html`
			<div class="d2l-grade-result-numeric-score-container">

				${!this.readOnly ? html`
					<div class="d2l-grade-result-numeric-score-score">
						<d2l-input-number
							label=${inputNumberLabel}
							label-hidden
							value="${this.scoreNumerator}"
							min="0"
							max-fraction-digits="2"
							novalidate
							@change=${this._onGradeChange}
						></d2l-input-number>
					</div>

					<div class="d2l-grade-result-numeric-score-score-text">
						${!isNaN(this.scoreDenominator) ? html`
							<span class="d2l-body-standard">/ ${this.scoreDenominator}</span>
						` : html``}
					</div>
				` : html`
					<div class="d2l-grade-result-numeric-score-score-read-only">
						<span class="d2l-body-standard">${this.scoreNumerator ? this.scoreNumerator : 0} / ${this.scoreDenominator}</span>
					</div>
				`}

			</div>
		`;
	}
}

customElements.define('d2l-grade-result-numeric-score', D2LGradeResultNumericScore);
