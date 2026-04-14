"""Generate static chart images for the stock trading blog post."""

import matplotlib.pyplot as plt
import matplotlib
import numpy as np
from pathlib import Path

matplotlib.use("Agg")

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "blog"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Agent benchmark data
agents = ["Hold", "Rule-based", "PPO (20k steps)", "Qwen 0.5B\n(zero-shot)", "DeepSeek 7B\n(zero-shot)"]
scores = [0.300, 0.293, 0.347, 0.379, 0.439]
returns = [0.00, -0.35, -1.30, 0.53, -0.63]

# Colors: muted grays for baselines, darker for LLMs
colors_score = ["#b0b0b0", "#b0b0b0", "#b0b0b0", "#4a4a4a", "#1a1a1a"]
colors_return = ["#b0b0b0", "#c46b6b", "#c46b6b", "#5a8a5a", "#c46b6b"]


def create_score_chart() -> None:
    fig, ax = plt.subplots(figsize=(10, 5))
    fig.patch.set_facecolor("#f2f2f2")
    ax.set_facecolor("#f2f2f2")

    y_pos = np.arange(len(agents))
    bars = ax.barh(y_pos, scores, color=colors_score, height=0.6, edgecolor="none")

    ax.set_yticks(y_pos)
    ax.set_yticklabels(agents, fontsize=12, fontfamily="sans-serif")
    ax.set_xlabel("Composite Score", fontsize=12, fontfamily="sans-serif")
    ax.set_title("Agent Performance Comparison", fontsize=16, fontweight="bold", fontfamily="sans-serif", pad=16)

    ax.set_xlim(0, 0.55)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["bottom"].set_color("#cccccc")
    ax.spines["left"].set_color("#cccccc")
    ax.tick_params(colors="#666666")
    ax.xaxis.label.set_color("#444444")

    for bar, score in zip(bars, scores):
        ax.text(
            bar.get_width() + 0.008,
            bar.get_y() + bar.get_height() / 2,
            f"{score:.3f}",
            va="center",
            fontsize=11,
            color="#333333",
            fontfamily="sans-serif",
        )

    # Annotation for the LLM results
    ax.annotate(
        "zero training",
        xy=(0.379, 3),
        xytext=(0.46, 2.2),
        fontsize=9,
        color="#666666",
        fontfamily="sans-serif",
        arrowprops=dict(arrowstyle="->", color="#999999", lw=0.8),
    )

    plt.tight_layout()
    fig.savefig(OUTPUT_DIR / "agent-scores.png", dpi=200, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"Saved: {OUTPUT_DIR / 'agent-scores.png'}")


if __name__ == "__main__":
    create_score_chart()
