const data = await fetch("./data.json")
	.then((response) => response.json())
	.catch((error) => console.error(error))

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const width = canvas.width
const height = canvas.height

const colors = {
	first: "#2a095f",
	second: "#3d02bd",
	third: "#e25bff",
	fourth: "#ddb1e1",
	fifth: "#fbefff",
}

// draw a bar graph of the phases

console.log(data)

const phases = data.phases
const duration = phases.reduce(
	(acc, phase) => acc + phase.duration + phase.grace,
	0
)

const barWidth = width / duration
const barHeight = 24

function getColorFromType(type) {
	if (type === "grace") {
		return colors.fourth
	}
	if (type === "shrinking") {
		return colors.third
	}
	return colors.second
}

function renderBars() {
	let x = 0
	let y = 0
	for (const phase of phases) {
		if (phase.stage === 0) {
			ctx.fillStyle = getColorFromType("grace")
			ctx.fillRect(x, y, phase.duration * barWidth, barHeight)
			x += phase.duration * barWidth
			continue
		}

		ctx.fillStyle = getColorFromType()
		ctx.fillRect(x, y, phase.grace * barWidth, barHeight)
		x += phase.grace * barWidth
		ctx.fillStyle = getColorFromType("shrinking")
		ctx.fillRect(x, y, phase.duration * barWidth, barHeight)
		x += phase.duration * barWidth
	}
}

let time = 0
const startButton = document.getElementById("start")

startButton.addEventListener("click", () => {
	time = performance.now()
	new Audio("./storm_shrinking_warning.ogg").play()
})

function update() {
	ctx.clearRect(0, 0, width, height)
	renderBars()
	const elapsed = performance.now() - time
	const elapsedSeconds = (elapsed / 1000) * 100
	document.getElementById("duration").innerText = elapsedSeconds.toFixed(0)
	ctx.fillStyle = "white"
	ctx.font = "30px Arial"
	ctx.fillText(elapsedSeconds.toFixed(0), 10, 50)

	// make bar
	ctx.fillStyle = "red"
	ctx.fillRect(elapsedSeconds * barWidth, 0, 2, height)

	requestAnimationFrame(update)
}
update()
