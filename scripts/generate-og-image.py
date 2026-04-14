"""Generate OG image for the stock trading blog post (1200x630)."""

import matplotlib.pyplot as plt
import matplotlib
from pathlib import Path

matplotlib.use("Agg")

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "blog"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 1200x630 at 200 DPI
fig = plt.figure(figsize=(6, 3.15), dpi=200)
fig.patch.set_facecolor("#141414")

ax = fig.add_axes([0, 0, 1, 1])
ax.set_facecolor("#141414")
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis("off")

# Title
ax.text(
    0.06, 0.72,
    "Training an LLM to Trade Stocks\nwith Reinforcement Learning",
    fontsize=14, fontweight="bold", color="#e8e8e8",
    fontfamily="sans-serif", va="top", linespacing=1.4,
)

# Subtitle / key result
ax.text(
    0.06, 0.38,
    "A 0.5B language model with zero training\nbeat a PPO agent trained for 20,000 steps.",
    fontsize=8, color="#888888",
    fontfamily="sans-serif", va="top", linespacing=1.5,
)

# Author
ax.text(
    0.06, 0.12,
    "sarthakb.xyz",
    fontsize=7, color="#555555",
    fontfamily="sans-serif", va="center",
)

# Minimal score bars on the right side
bar_data = [
    ("Hold", 0.300),
    ("RSI", 0.293),
    ("PPO", 0.347),
    ("Qwen 0.5B", 0.379),
    ("DeepSeek 7B", 0.439),
]

bar_x = 0.62
bar_w_max = 0.32
bar_h = 0.06
bar_gap = 0.09
start_y = 0.72

for i, (name, score) in enumerate(bar_data):
    y = start_y - i * bar_gap
    w = (score / 0.55) * bar_w_max
    color = "#555555" if i < 3 else "#b0b0b0" if i == 3 else "#e8e8e8"
    ax.barh(y, w, height=bar_h, left=bar_x, color=color, edgecolor="none")
    ax.text(bar_x - 0.01, y, name, fontsize=5, color="#777777",
            fontfamily="sans-serif", va="center", ha="right")
    ax.text(bar_x + w + 0.008, y, f"{score:.3f}", fontsize=5, color="#666666",
            fontfamily="sans-serif", va="center")

fig.savefig(
    OUTPUT_DIR / "og-training-llm-to-trade.png",
    dpi=200, bbox_inches="tight", pad_inches=0,
    facecolor=fig.get_facecolor(),
)
plt.close(fig)
print(f"Saved: {OUTPUT_DIR / 'og-training-llm-to-trade.png'}")
