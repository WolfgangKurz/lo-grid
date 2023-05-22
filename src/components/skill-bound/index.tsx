import Decimal from "decimal.js";
import { FunctionalComponent } from "preact";

import "./style.scss";

interface BoundData {
	match: string;
	offset: number;
	global: boolean;
}

interface BoundListEntity {
	level: number;
	bound: BoundData;
}

interface SkillBoundProps {
	/** 인게임 색상 사용 (빨간색 대신 노란색) */
	alt: boolean;

	/** 대상 */
	target: "team" | "enemy";

	/** 소모 AP */
	ap: number;

	/** 사거리 */
	range: number;

	/** 각 영역 값 */
	grid: number[];

	/** 기준 위치, `true` = global, 0-based */
	offset: number | true;

	/** 패시브 스킬 여부 */
	passive: boolean;
}

const SkillBound: FunctionalComponent<SkillBoundProps> = ({ alt, target, ap, range, grid, offset, passive }) => {
	const AP = ap;
	const Range = range;

	const IsGlobal = offset === true;

	const rangeBack = new Array(6)
		.fill(0)
		.map((_, i) => <span class="grid" data-pos={ i + 1 } />);

	const gridBack = new Array(9)
		.fill(0)
		.map((_, i) => <span class="grid" data-pos={ i + 1 } />);

	const rangeCells = new Array(Math.min(Range, 6))
		.fill(0)
		.map((_, i) => <span class="range" data-pos={ i + 1 } />);

	const targets: preact.VNode[] = [];
	const t = grid;

	const only = (() => {
		if (grid.filter(r => r > 0).length === 1)
			return grid.findIndex(r => r > 0);
		return false;
	})();

	for (let i = 0; i < t.length; i++) {
		const c = t[i];
		if (c === 0) continue;

		const v = Decimal.mul(100, c).toString();
		targets.push(<span class={ `target target-${v} ${target} ${alt ? "alt" : ""}` } data-pos={ i + 1 } />);
	}

	return <div class="skill-bound" data-passive={ passive ? 1 : 0 }>
		<div class="skill-range">
			{ rangeBack }
			{ rangeCells }
			<div class="skill-range-circle font-exo2" title={ Range.toString() }>
				{ /* Math.min(6, Range) */ Range }
			</div>
		</div>

		<div class="skill-ap font-exo2">
			<div class="me-1">AP</div>
			{ AP }
		</div>

		<div class="skill-grid">
			{ gridBack }
			{ IsGlobal
				? <></>
				: <span class="offset" data-pos={ offset + 1 } />
			}
			{ targets }
		</div>

		{ IsGlobal
			? <div class="global-text">고정 범위</div>
			: <></>
		}
		{ target === "team"
			? <div class="team-text">
				{ only === offset
					? "본인 대상"
					: "아군 대상"
				}
			</div>
			: <></>
		}
	</div>;
};
export default SkillBound;
