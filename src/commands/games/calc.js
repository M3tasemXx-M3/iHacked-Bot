const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calc")
    .setDescription(
      "Calculate any basic or advanced mathematical expression professionally.",
    )
    .addStringOption((option) =>
      option
        .setName("expression")
        .setDescription(
          "The equation to solve (e.g., 2 + 5 * 3, sqrt(16), 2^3)",
        )
        .setRequired(true),
    ),

  async execute(interaction) {
    const rawExpression = interaction.options.getString("expression");

    // 1. نظام حماية صارم: تصفية المدخلات لمنع تشغيل أي جافاسكريبت خبيث (RCE Protection)
    // يسمح فقط بالأرقام، العمليات الحسابية، والأحرف الخاصة بالدوال الرياضية المدعومة فقط
    const validCharactersRegex =
      /[0-9+\-*/().\s%^]|(sqrt|sin|cos|tan|log|pi|pow|abs|round|floor|ceil)/gi;
    const invalidChars = rawExpression.replace(validCharactersRegex, "");

    if (invalidChars.length > 0) {
      return interaction.reply({
        content:
          "❌ **Security Block:** Your expression contains illegal or dangerous characters. Only clean mathematical syntax is permitted.",
        ephemeral: true,
      });
    }

    try {
      // 2. تحويل الصيغ النصية العادية إلى صيغ برمجية يفهمها محرك الـ Math في الـ JavaScript
      let formattedExpression = rawExpression
        .toLowerCase()
        .replace(/pi/g, "Math.PI")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log")
        .replace(/pow/g, "Math.pow")
        .replace(/abs/g, "Math.abs")
        .replace(/round/g, "Math.round")
        .replace(/floor/g, "Math.floor")
        .replace(/ceil/g, "Math.ceil")
        .replace(/\^/g, "**"); // تحويل علامة الـ الأس ^ إلى معامل القوة البرمجي **

      // الحساب الفعلي الآمن باستخدام دالة مخصصة ومعزولة
      const result = new Function(`return ${formattedExpression}`)();

      // التحقق من أن النتيجة رقم حقيقي وليس خطأً رياضياً (مثل القسمة على صفر)
      if (
        result === null ||
        result === undefined ||
        isNaN(result) ||
        !isFinite(result)
      ) {
        throw new Error("Math Error");
      }

      // 3. تنسيق النتيجة لتبدو احترافية (مثال: تقريب الفواصل اللانهائية وإضافة فواصل الآلاف)
      const formattedResult = Number(result).toLocaleString(undefined, {
        maximumFractionDigits: 6, // أقصى حد للأرقام بعد الفاصلة هو 6 خانات
      });

      // 4. بناء الـ Embed الاحترافي المتناسق مع بقية نظام البوت
      const calcEmbed = new EmbedBuilder()
        .setColor("#3b82f6") // لون أزرق أنيق مخصص للعمليات الحسابية والتقنية
        .setAuthor({
          name: "Bot Advanced Calculator",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setDescription(
          "### 🧮 Core Processing Engine\nThe mathematical mainframe has compiled and evaluated your expression successfully.",
        )
        .addFields(
          {
            name: "📥 Input Expression",
            value: `\`\`\`math\n${rawExpression}\n\`\`\``,
            inline: false,
          },
          {
            name: "📤 Calculated Output",
            value: `\`\`\`js\n${formattedResult}\n\`\`\``,
            inline: false,
          },
        )
        .setFooter({
          text: `Calculation requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      return interaction.reply({ embeds: [calcEmbed] });
    } catch (error) {
      // التعامل مع أخطاء الصياغة الرياضية (مثل نسيان إغلاق قوس أو عملية غير مكتملة)
      return interaction.reply({
        content:
          "❌ **Mathematical Syntax Error!** Please review your equation formatting (e.g., ensure all parentheses are closed correctly).",
        ephemeral: true,
      });
    }
  },
};
