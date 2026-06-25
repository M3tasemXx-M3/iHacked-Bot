const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View gaming profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("Target user").setRequired(false),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const stats = GameStats.get(target.id);

    if (!stats) {
      return interaction.reply({
        content: "❌ Profile not found.",
        ephemeral: true,
      });
    }

    const rank = GameStats.getRank(target.id);

    // إعداد مصفوفة الإنجازات المحققة بناءً على بيانات اللاعب
    const achievementsList = [];
    if (stats.level >= 10)
      achievementsList.push({ icon: "chart", color: "#22c55e" });
    if (stats.level >= 25)
      achievementsList.push({ icon: "medal", color: "#6366f1" });
    if (stats.level >= 50)
      achievementsList.push({ icon: "crown", color: "#eab308" });
    if (stats.mathWins >= 10)
      achievementsList.push({ icon: "brain", color: "#ec4899" });
    if (stats.mathWins >= 100)
      achievementsList.push({ icon: "diamond", color: "#3b82f6" });
    if (stats.topStreak >= 10)
      achievementsList.push({ icon: "fire", color: "#f97316" });

    // إنشاء أبعاد الصورة
    const canvas = createCanvas(1200, 720);
    const ctx = canvas.getContext("2d");

    /* ========================= BACKGROUND ========================= */
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* ========================= MAIN PANEL CONTAINER ========================= */
    ctx.fillStyle = "#080c1a";
    roundRect(ctx, 30, 90, 1140, 580, 20);
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    /* ========================= HEADER TITLE ========================= */
    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = "#6366f1";
    ctx.fillText("iHacked", 35, 55);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Core Profile", 175, 55);

    /* ========================= AVATAR & RING ========================= */
    const avatarX = 140;
    const avatarY = 220;
    const avatarRadius = 75;

    // رسم هالة النيون الملونة حول الصورة الشخصية (Gradient)
    ctx.save();
    const avatarRing = ctx.createLinearGradient(60, 140, 220, 300);
    avatarRing.addColorStop(0, "#00ffcc");
    avatarRing.addColorStop(0.5, "#3b82f6");
    avatarRing.addColorStop(1, "#d946ef");
    ctx.strokeStyle = avatarRing;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // قص ورسم الصورة الشخصية داخل دائرة
    try {
      const avatar = await loadImage(
        target.displayAvatarURL({ extension: "png", size: 256 }),
      );
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        avatar,
        avatarX - avatarRadius,
        avatarY - avatarRadius,
        avatarRadius * 2,
        avatarRadius * 2,
      );
      ctx.restore();
    } catch (e) {
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    /* ========================= USER INFO & XP BAR ========================= */
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText(target.username, 250, 175);

    // أيقونة الجيم باد بجانب رتبة اللاعب النصية
    drawCyberIcon(ctx, "gamepad", 250, 198, 22, "#64748b");
    ctx.fillStyle = "#64748b";
    ctx.font = "18px sans-serif";
    ctx.fillText(stats.title || "Rookie", 288, 215);

    // رسم علامة النجمة للمستوى (Level Badge)
    drawStar(ctx, 255, 260, 5, 18, 9, "#eab308");
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(stats.level.toString(), 255, 265);
    ctx.textAlign = "left";

    // شريط الـ XP الخلفي
    const neededXP = stats.level * 100;
    const percent = Math.min(stats.xp / neededXP, 1);
    const xpBarX = 290;
    const xpBarY = 248;
    const xpBarW = 420;
    const xpBarH = 22;

    ctx.fillStyle = "#111827";
    roundRect(ctx, xpBarX, xpBarY, xpBarW, xpBarH, 10);
    ctx.fill();

    // تعبئة شريط الـ XP الملون متدرج
    const xpGradient = ctx.createLinearGradient(
      xpBarX,
      xpBarY,
      xpBarX + xpBarW,
      xpBarY,
    );
    xpGradient.addColorStop(0, "#22c55e");
    xpGradient.addColorStop(1, "#06b6d4");
    ctx.fillStyle = xpGradient;
    roundRect(ctx, xpBarX, xpBarY, xpBarW * percent, xpBarH, 10);
    ctx.fill();

    // نصوص المستوى والـ XP تحت الشريط
    ctx.fillStyle = "#64748b";
    ctx.font = "15px sans-serif";
    ctx.fillText(`Level ${stats.level}`, 250, 305);
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`${stats.xp} / ${neededXP} XP`, 340, 305);

    /* ========================= STREAK BOX (TOP RIGHT) ========================= */
    const streakX = 760;
    const streakY = 130;
    const streakW = 370;
    const streakH = 160;

    ctx.fillStyle = "#0c101f";
    roundRect(ctx, streakX, streakY, streakW, streakH, 15);
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.stroke();

    drawCyberIcon(ctx, "fire", streakX + 25, streakY + 25, 26, "#f97316");
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Streak", streakX + 65, streakY + 48);

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#f59e0b";
    ctx.fillText(`Current: x${stats.streak || 0}`, streakX + 25, streakY + 95);
    ctx.fillStyle = "#818cf8";
    ctx.fillText(`Best: x${stats.topStreak || 0}`, streakX + 25, streakY + 130);

    // رسم شعاع ناري كبير مضيء على يمين مربع الستريك
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 15;
    drawCyberIcon(ctx, "fire", streakX + 230, streakY + 25, 100, "#ff781f");
    ctx.shadowBlur = 0;

    /* ========================= BOTTOM ROW PANELS ========================= */
    const panelY = 340;
    const panelH = 240;

    // 1. مربع الإحصائيات والإنجازات (اليسار العريض)
    const statsX = 60;
    const statsW = 540;
    ctx.fillStyle = "#090d1a";
    roundRect(ctx, statsX, panelY, statsW, panelH, 15);
    ctx.fill();
    ctx.stroke();

    drawCyberIcon(ctx, "trophy", statsX + 20, panelY + 20, 26, "#eab308");
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("Game Statistics & Achievements", statsX + 55, panelY + 40);

    // نصوص الإحصائيات مع الأيقونات الخاصة بكل سطر
    const winRate =
      stats.gamesPlayed > 0
        ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)
        : "0.0";

    // سطر Wins
    drawCyberIcon(ctx, "trophy", statsX + 20, panelY + 75, 20, "#22c55e");
    ctx.fillStyle = "#64748b";
    ctx.font = "16px sans-serif";
    ctx.fillText("Wins:", statsX + 50, panelY + 92);
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(stats.wins.toString(), statsX + 170, panelY + 92);

    // سطر Losses
    drawCyberIcon(ctx, "cross", statsX + 20, panelY + 115, 20, "#ef4444");
    ctx.fillStyle = "#64748b";
    ctx.font = "16px sans-serif";
    ctx.fillText("Losses:", statsX + 50, panelY + 132);
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(stats.losses.toString(), statsX + 170, panelY + 132);

    // سطر Games Played
    drawCyberIcon(ctx, "gamepad", statsX + 20, panelY + 155, 20, "#3b82f6");
    ctx.fillStyle = "#64748b";
    ctx.font = "16px sans-serif";
    ctx.fillText("Games Played:", statsX + 50, panelY + 172);
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(stats.gamesPlayed.toString(), statsX + 170, panelY + 172);

    // سطر Win Rate
    drawCyberIcon(ctx, "chart", statsX + 20, panelY + 195, 20, "#a855f7");
    ctx.fillStyle = "#64748b";
    ctx.font = "16px sans-serif";
    ctx.fillText("Win Rate:", statsX + 50, panelY + 212);
    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`${winRate}%`, statsX + 170, panelY + 212);

    // رسم قسم شبكة الانجازات (Achievements Grid) على اليمين داخل نفس المربع
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Achievements", statsX + 260, panelY + 92);

    let hexX = statsX + 285;
    let hexY = panelY + 135;
    let hexCount = 0;

    // رسم الـ 12 خانة سداسية للإنجازات
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 6; col++) {
        const ach = achievementsList[hexCount];
        const currentX = hexX + col * 42;
        const currentY = hexY + row * 45;

        if (ach) {
          drawHexagon(ctx, currentX, currentY, 18, "#131a30", ach.color);
          drawCyberIcon(
            ctx,
            ach.icon,
            currentX - 10,
            currentY - 10,
            20,
            "#ffffff",
          );
        } else {
          drawHexagon(ctx, currentX, currentY, 18, "#0c1020", "#1e293b");
        }
        hexCount++;
      }
    }

    // 2. مربع الاقتصاد (الوسط)
    const econX = 620;
    const econW = 260;
    ctx.fillStyle = "#090d1a";
    roundRect(ctx, econX, panelY, econW, panelH, 15);
    ctx.fill();
    ctx.stroke();

    drawCyberIcon(ctx, "coin", econX + 20, panelY + 20, 26, "#eab308");
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("Economy", econX + 55, panelY + 40);

    drawCyberIcon(ctx, "coin", econX + 20, panelY + 75, 20, "#eab308");
    ctx.fillStyle = "#64748b";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Coins: `, econX + 50, panelY + 92);
    ctx.fillStyle = "#eab308";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(stats.coins.toString(), econX + 110, panelY + 92);

    drawCyberIcon(ctx, "bank", econX + 20, panelY + 115, 20, "#3b82f6");
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Bank: `, econX + 50, panelY + 132);
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(stats.bank.toString(), econX + 110, panelY + 132);

    drawCyberIcon(ctx, "diamond", econX + 20, panelY + 155, 20, "#d946ef");
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Prestige: `, econX + 50, panelY + 172);
    ctx.fillStyle = "#d946ef";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText((stats.prestige || 0).toString(), econX + 130, panelY + 172);

    drawCyberIcon(ctx, "medal", econX + 20, panelY + 195, 20, "#ec4899");
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Rank: `, econX + 50, panelY + 212);
    ctx.fillStyle = "#ec4899";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`#${rank}`, econX + 110, panelY + 212);

    // 3. مربع الألعاب المصغرة Mini Games (اليمين)
    const miniX = 900;
    const miniW = 240;
    ctx.fillStyle = "#090d1a";
    roundRect(ctx, miniX, panelY, miniW, panelH, 15);
    ctx.fill();
    ctx.stroke();

    drawCyberIcon(ctx, "gamepad", miniX + 20, panelY + 20, 26, "#10b981");
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("Mini Games", miniX + 55, panelY + 40);

    drawCyberIcon(ctx, "brain", miniX + 20, panelY + 75, 20, "#10b981");
    ctx.fillStyle = "#64748b";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Math: `, miniX + 50, panelY + 92);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText((stats.mathWins || 0).toString(), miniX + 140, panelY + 92);

    drawCyberIcon(ctx, "card", miniX + 20, panelY + 115, 20, "#3b82f6");
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Blackjack: `, miniX + 50, panelY + 132);
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(
      (stats.blackjackWins || 0).toString(),
      miniX + 140,
      panelY + 132,
    );

    drawCyberIcon(ctx, "slots", miniX + 20, panelY + 155, 20, "#f59e0b");
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Slots: `, miniX + 50, panelY + 172);
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText((stats.slotsWins || 0).toString(), miniX + 140, panelY + 172);

    drawCyberIcon(ctx, "roulette", miniX + 20, panelY + 195, 20, "#a855f7");
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Roulette: `, miniX + 50, panelY + 212);
    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(
      (stats.rouletteWins || 0).toString(),
      miniX + 140,
      panelY + 212,
    );

    /* ========================= FOOTER ========================= */
    const footerY = 605;
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    roundRect(ctx, 50, footerY, 1100, 45, 10);
    ctx.fill();

    drawCyberIcon(ctx, "crown", 70, footerY + 12, 20, "#6366f1");
    ctx.fillStyle = "#475569";
    ctx.font = "14px sans-serif";
    ctx.fillText(
      `iHacked-Core   •   ${new Date().toLocaleDateString()}`,
      100,
      footerY + 28,
    );

    // الخطوط المائلة الجمالية أسفل اليمين
    ctx.strokeStyle = "#4338ca";
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(1080 + i * 12, footerY + 33);
      ctx.lineTo(1095 + i * 12, footerY + 12);
      ctx.stroke();
    }

    /* ========================= SEND ATTACHMENT ========================= */
    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "profile.png",
    });

    return interaction.reply({ files: [attachment] });
  },
};

/* =========================================================================
   FUNCTIONS HELPERS (محرك الرسم الهندسي المستقل والمحمي ضد الأخطاء)
   ========================================================================= */

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawHexagon(ctx, x, y, size, fillColor, strokeColor) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    let angle = (Math.PI / 3) * i - Math.PI / 2;
    ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
  }
  ctx.closePath();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, fillColor) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
}

// محرك رسم الأيقونات السيبرانية الخالص - سريع ومتوافق 100%
function drawCyberIcon(ctx, type, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (type) {
    case "gamepad":
      ctx.beginPath();
      roundRect(ctx, x, y + size * 0.1, size * 1.4, size * 0.8, 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + size * 0.2, y + size * 0.5);
      ctx.lineTo(x + size * 0.5, y + size * 0.5);
      ctx.moveTo(x + size * 0.35, y + size * 0.35);
      ctx.lineTo(x + size * 0.35, y + size * 0.65);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + size * 1.0, y + size * 0.45, 2, 0, Math.PI * 2);
      ctx.arc(x + size * 1.2, y + size * 0.55, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "trophy":
      ctx.beginPath();
      ctx.moveTo(x + size * 0.2, y + size * 0.1);
      ctx.lineTo(x + size * 0.8, y + size * 0.1);
      ctx.lineTo(x + size * 0.7, y + size * 0.6);
      ctx.quadraticCurveTo(
        x + size * 0.5,
        y + size * 0.8,
        x + size * 0.3,
        y + size * 0.6,
      );
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y + size * 0.75);
      ctx.lineTo(x + size * 0.5, y + size * 0.9);
      ctx.moveTo(x + size * 0.3, y + size * 0.9);
      ctx.lineTo(x + size * 0.7, y + size * 0.9);
      ctx.stroke();
      break;
    case "cross":
      ctx.beginPath();
      ctx.moveTo(x + size * 0.2, y + size * 0.2);
      ctx.lineTo(x + size * 0.8, y + size * 0.8);
      ctx.moveTo(x + size * 0.8, y + size * 0.2);
      ctx.lineTo(x + size * 0.2, y + size * 0.8);
      ctx.stroke();
      break;
    case "chart":
      ctx.fillRect(x + size * 0.15, y + size * 0.6, size * 0.15, size * 0.3);
      ctx.fillRect(x + size * 0.42, y + size * 0.4, size * 0.15, size * 0.5);
      ctx.fillRect(x + size * 0.7, y + size * 0.2, size * 0.15, size * 0.7);
      break;
    case "coin":
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.5, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = `bold ${size * 0.45}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", x + size * 0.5, y + size * 0.53);
      break;
    case "bank":
      ctx.beginPath();
      ctx.moveTo(x + size * 0.1, y + size * 0.35);
      ctx.lineTo(x + size * 0.5, y + size * 0.1);
      ctx.lineTo(x + size * 0.9, y + size * 0.35);
      ctx.closePath();
      ctx.stroke();
      ctx.fillRect(x + size * 0.2, y + size * 0.4, size * 0.1, size * 0.4);
      ctx.fillRect(x + size * 0.45, y + size * 0.4, size * 0.1, size * 0.4);
      ctx.fillRect(x + size * 0.7, y + size * 0.4, size * 0.1, size * 0.4);
      ctx.fillRect(x + size * 0.1, y + size * 0.82, size * 0.8, size * 0.08);
      break;
    case "diamond":
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y + size * 0.1);
      ctx.lineTo(x + size * 0.9, y + size * 0.5);
      ctx.lineTo(x + size * 0.5, y + size * 0.9);
      ctx.lineTo(x + size * 0.1, y + size * 0.5);
      ctx.closePath();
      ctx.stroke();
      break;
    case "medal":
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.65, size * 0.28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + size * 0.3, y + size * 0.1);
      ctx.lineTo(x + size * 0.5, y + size * 0.45);
      ctx.lineTo(x + size * 0.7, y + size * 0.1);
      ctx.stroke();
      break;
    case "brain":
      ctx.strokeRect(x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6);
      ctx.fillRect(x + size * 0.38, y + size * 0.38, size * 0.24, size * 0.24);
      ctx.fillRect(x + size * 0.05, y + size * 0.3, size * 0.15, size * 0.1);
      ctx.fillRect(x + size * 0.05, y + size * 0.6, size * 0.15, size * 0.1);
      ctx.fillRect(x + size * 0.8, y + size * 0.3, size * 0.15, size * 0.1);
      ctx.fillRect(x + size * 0.8, y + size * 0.6, size * 0.15, size * 0.1);
      break;
    case "card":
      ctx.save();
      ctx.translate(x + size * 0.5, y + size * 0.5);
      ctx.rotate(0.2);
      roundRect(ctx, -size * 0.4, -size * 0.25, size * 0.8, size * 0.5, 4);
      ctx.stroke();
      ctx.restore();
      break;
    case "slots":
      ctx.strokeRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8);
      ctx.strokeRect(x + size * 0.25, y + size * 0.25, size * 0.5, size * 0.5);
      ctx.fillRect(x + size * 0.3, y + size * 0.45, size * 0.4, size * 0.1);
      break;
    case "roulette":
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.5, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.5, size * 0.15, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "fire":
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y + size * 0.05);
      ctx.quadraticCurveTo(
        x + size * 0.85,
        y + size * 0.45,
        x + size * 0.75,
        y + size * 0.8,
      );
      ctx.quadraticCurveTo(
        x + size * 0.5,
        y + size * 1.0,
        x + size * 0.25,
        y + size * 0.8,
      );
      ctx.quadraticCurveTo(
        x + size * 0.15,
        y + size * 0.45,
        x + size * 0.5,
        y + size * 0.05,
      );
      ctx.closePath();
      ctx.stroke();
      break;
    case "crown":
      ctx.beginPath();
      ctx.moveTo(x + size * 0.1, y + size * 0.8);
      ctx.lineTo(x + size * 0.1, y + size * 0.3);
      ctx.lineTo(x + size * 0.35, y + size * 0.55);
      ctx.lineTo(x + size * 0.5, y + size * 0.2);
      ctx.lineTo(x + size * 0.65, y + size * 0.55);
      ctx.lineTo(x + size * 0.9, y + size * 0.3);
      ctx.lineTo(x + size * 0.9, y + size * 0.8);
      ctx.closePath();
      ctx.stroke();
      break;
  }
  ctx.restore();
}
