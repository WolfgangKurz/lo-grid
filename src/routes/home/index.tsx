import { FunctionalComponent } from "preact";
import { useRef } from "preact/hooks";

import { objState } from "@/libs/State";
import { SetMeta, UpdateTitle } from "@/libs/Site";
import Hermite_class from "@/libs/Hermit";

import SkillBound from "@/components/skill-bound";

import style from "./style.module.scss";

interface Props {
	p1?: string;
	p2?: string;
}

const canvas: HTMLCanvasElement = document.createElement("canvas");

const image = new Image();
image.src = "/skill-parallelogram.png";

const circle = new Image();
circle.src = "/range-circle.png";

const HomeContent: FunctionalComponent<Props> = (props) => {
	const [p1, p2, p3] = (() => {
		const def1 = [false, false, false, 5, 3, 4];
		const p1 = (() => {
			const arr = (props.p1 ?? "").split(",");
			while (arr.length < def1.length) arr.push("");

			return arr
				.map(r => parseInt(r, 10))
				.map((r, i) => isNaN(r) ? def1[i] : r);
		})();

		const p2 = (() => {
			const arr = (props.p2 ?? "").split(",");
			while (arr.length < 9) arr.push("");

			return arr
				.map(r => parseInt(r, 10))
				.map((r, i) => isNaN(r) ? 100 : r);
		})();

		return [
			[!!p1[0], !!p1[1], !!p1[2]],
			[p1[3], p1[4], p1[5]] as number[],
			p2.map(r => r / 100),
		];
	})();

	const IsAlt = objState<boolean>(true);
	const IsGlobal = objState<boolean>(p1[0]);
	const IsPassive = objState<boolean>(p1[1]);
	const IsTeam = objState<boolean>(p1[2]);
	const AP = objState<number>(p2[0]);
	const Range = objState<number>(p2[1]);
	const Offset = objState<number>(p2[2]);
	const Grid = objState<number[]>(p3);

	const BoundElem = useRef<HTMLDivElement>(null);

	const values = [1, 0.75, 0.5, 0.25, 0.1];

	const url = (() => {
		const r: Array<string | number> = [];

		r.push(IsGlobal.value ? 1 : 0);
		r.push(IsPassive.value ? 1 : 0);
		r.push(IsTeam.value ? 1 : 0);
		r.push(AP.value);
		r.push(Range.value);
		r.push(Offset.value);
		return r.join(",") + "/" + Grid.value.map(v => v * 100).join(",");
	})();
	const fullURL = `${window.location.origin}/${url}`;

	return <div class={ `${style.home} home` }>
		<h2>
			<img class={ `${style["heading-icon"]} heading-icon` } src="/icon.png" />
			<span class={ style["home-title"] }>
				<span class="font-exo">LO-Grid</span>
			</span>
		</h2>
		<div class="mb-4 text-secondary">
			<a href="https://lo.swaytwig.com/" target="_blank">https://lo.swaytwig.com/</a>
		</div>

		<div class={ style.GridBack }>
			<div ref={ BoundElem }>
				<SkillBound
					alt={ IsAlt.value }
					ap={ AP.value }
					grid={ Grid.value }
					offset={ IsGlobal.value ? true : Offset.value }
					passive={ IsPassive.value }
					range={ Range.value }
					target={ IsTeam.value ? "team" : "enemy" }
				/>
			</div>
		</div>
		<div class="mb-4">
			<a class={ style.Link } href={ fullURL } target="_blank">{ fullURL }</a>
			<div>
				<button
					class="btn btn-success"
					onClick={ (ev) => {
						ev.preventDefault();

						const el = BoundElem.current;
						if (!el) return;

						const c = el.querySelector("div")!;

						const r = 38 / 14;
						const ow = c.clientWidth;
						const oh = c.clientHeight;
						const w = canvas.width = el.clientWidth * r;
						const h = canvas.height = el.clientHeight * r;

						const cw = 14;
						const ch = cw / 38 * 34;

						const ctx = canvas.getContext("2d");
						if (!ctx) return;

						ctx.imageSmoothingEnabled = true;
						ctx.imageSmoothingQuality = "high";

						ctx.shadowColor = "#000";
						// ctx.shadowOffsetX = w;

						ctx.fillStyle = "#212529"; // $dark
						ctx.fillRect(0, 0, w, h);

						const text = (text: string, x: number, y: number) => {
							ctx.shadowBlur = 3 * r;
							ctx.fillText(text, x, y);

							ctx.shadowBlur = 2 * r;
							ctx.fillText(text, x, y);
							ctx.fillText(text, x, y);

							ctx.shadowBlur = 0;
							// ctx.fillText(text, x, y);
						};
						const xy = (i: number) => {
							const x1 = 0;
							const x2 = cw + 2;
							const x3 = x2 * 2;
							const _x = [x1, x2, x3];

							const y3 = 0;
							const y2 = ch + 3;
							const y1 = y2 * 2;
							const _y = [y1, y2, y3];

							const x = 2 + _x[i % 3] + Math.floor(i / 3) * 2;
							const y = 2 + _y[Math.floor(i / 3)];
							return [x, y];
						};

						const rootStyle = getComputedStyle(el);
						ctx.scale(r, r);
						ctx.translate(
							parseFloat(rootStyle.paddingLeft),
							parseFloat(rootStyle.paddingTop),
						);

						// Draw range back
						for (let i = 0; i < 6; i++) {
							ctx.drawImage(
								image,
								0, 0, 38, 34,
								2 + i * 15, 6, cw, ch,
							);
						}

						// Draw range block
						for (let i = 0; i < Range.value; i++) {
							ctx.drawImage(
								image,
								38 * 7, 0, 38, 34,
								i * 15, 4, cw, ch,
							);
						}

						// Draw range
						ctx.drawImage(
							circle,
							ow - 24, 0, 24, 24,
						);
						ctx.font = "13px 'Exo 2'";
						ctx.fillStyle = "#ffd91c";
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						text(
							Range.value.toString(),
							ow - 24 + 12, 12,
						);

						// next line
						ctx.translate(0, 24 + 5);
						ctx.textBaseline = "hanging";

						// AP
						ctx.save();
						ctx.translate(-10, 2 + 5);

						ctx.font = "bold 16px 'Exo 2'";
						ctx.fillStyle = "#fff";
						ctx.textAlign = "end";
						text("AP", ow, 0);

						ctx.fillStyle = "#00efef";
						ctx.textAlign = "center";
						text(AP.value.toString(), ow - 11, 20);

						if (IsTeam.value) {
							ctx.font = "11px 'IBM Plex Sans KR','IBM Plex Sans'";
							text("아군 대상", ow - 11, 44);
						}
						ctx.restore();

						if (IsPassive.value) {
							ctx.fillStyle = "rgba(33,37,41,0.625)"; // $dark
							ctx.fillRect(-w, -h, w * 3, h * 3);
						}

						// grid
						ctx.save();
						ctx.translate(10, 0);
						for (let i = 0; i < 9; i++) {
							const [x, y] = xy(i);

							if (!IsGlobal.value && Offset.value === i) {
								ctx.drawImage(
									image,
									38, 0, 38, 34,
									x, y, cw, ch,
								);
							} else {
								ctx.drawImage(
									image,
									0, 0, 38, 34,
									x, y, cw, ch,
								);
							}
						}

						if (IsGlobal.value) {
							ctx.font = "11px 'IBM Plex Sans KR','IBM Plex Sans'";
							ctx.fillStyle = "#00efef";
							ctx.textAlign = "center";
							ctx.textBaseline = "hanging";
							text("고정 범위", 24, 46 + 5);
						}

						for (let i = 0; i < 9; i++) {
							const [x, y] = xy(i);

							let p = values.indexOf(Grid.value[i]);
							if (p >= 0) p += 2;

							ctx.drawImage(
								image,
								p * 38, IsAlt.value ? 34 : 0, 38, 34,
								x - 2, y - 2, cw, ch,
							);
						}
						ctx.restore();

						const oow = el.clientWidth;
						const ooh = el.clientHeight;

						const HERMIT = new Hermite_class();
						HERMIT.resample_single(canvas, oow, ooh, true);
						canvas.toBlob(blob => {
							if (!blob) return;

							const url = URL.createObjectURL(blob);
							const a = document.createElement("a");
							document.body.appendChild(a);
							a.href = url;
							a.download = "grid.png";
							a.click();

							setTimeout(() => {
								window.URL.revokeObjectURL(url);
								document.body.removeChild(a);
							}, 0);
						}, "image/png");
					} }
				>
					이미지 다운로드
				</button>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
				<div class="input-group mb-1">
					<span class="input-group-text">
						<input
							class="form-check-input"
							type="checkbox"
							checked={ IsAlt.value }
							onClick={ (): void => IsAlt.set(!IsAlt.value) }
						/>
					</span>
					<div class="form-control">
						<i>인게임 색상</i>
					</div>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
				<div class="input-group mb-1">
					<span class="input-group-text">
						<input
							class="form-check-input"
							type="checkbox"
							checked={ IsPassive.value }
							onClick={ (): void => IsPassive.set(!IsPassive.value) }
						/>
					</span>
					<div class="form-control">
						<i>패시브 스킬</i>
					</div>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
				<div class="input-group mb-1">
					<span class="input-group-text">
						<input
							class="form-check-input"
							type="checkbox"
							checked={ IsTeam.value }
							onClick={ (): void => IsTeam.set(!IsTeam.value) }
						/>
					</span>
					<div class="form-control">
						<i>아군 대상</i>
					</div>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
				<div class="input-group mb-1">
					<span class="input-group-text">AP</span>
					<input
						type="text"
						class="form-control text-end"
						value={ AP.value }
						onInput={ (e): void => AP.set(parseInt((e.target as HTMLInputElement).value, 10)) }
					/>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
				<div class="input-group mb-1">
					<span class="input-group-text">사거리</span>
					<input
						type="text"
						class="form-control text-end"
						value={ Range.value }
						onInput={ (e): void => Range.set(parseInt((e.target as HTMLInputElement).value, 10)) }
					/>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
				<div class="input-group mb-1">
					<span class="input-group-text">기준 위치</span>
					<div class="form-control">
						<div class="form-check d-inline-block form-switch">
							<label class="form-check-label">
								<input
									class="form-check-input"
									type="checkbox"
									checked={ IsGlobal.value }
									onClick={ (): void => IsGlobal.set(!IsGlobal.value) }
								/>
								고정 범위
							</label>
						</div>

						{ IsGlobal.value === false
							? <div class="mt-1">
								<div class={ style.Grid }>
									{ [6, 7, 8, 3, 4, 5, 0, 1, 2].map(i => <button
										class={ `btn btn-${Offset.value === i ? "primary" : "outline-primary"}` }
										onClick={ (e) => {
											e.preventDefault();
											Offset.set(i);
										} }
									/>) }
								</div>
							</div>
							: <></>
						}
					</div>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
				<div class="input-group mb-1">
					<span class="input-group-text">수치</span>
					<div class="form-control">
						<div class={ `${style.Grid} ${style.Values}` }>
							{ [6, 7, 8, 3, 4, 5, 0, 1, 2].map(i => <button
								class={ `btn btn-${Grid.value[i] === 0 ? "secondary" : "dark"}` }
								onClick={ (e) => {
									e.preventDefault();
									const v = Grid.value[i];
									const idx = values.indexOf(v);
									const arr = [...Grid.value];
									arr[i] = values[idx + 1] || 0;
									Grid.set(arr);
								} }
							>
								<div>
									{ Grid.value[i] * 100 }%
								</div>
								<div class={ `${style.ValueColor} ${IsAlt.value ? "alt" : ""}` } data-value={ Grid.value[i] * 100 } />
							</button>) }
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>;
};

const Home: FunctionalComponent<Props> = (props) => {
	SetMeta(["description", "twitter:description"], null);
	SetMeta(["twitter:image", "og:image"], null);
	UpdateTitle();

	return <HomeContent p1={ props.p1 } p2={ props.p2 } />;
};
export default Home;
