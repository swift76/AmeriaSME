namespace BankProcessingSimulator
{
    partial class MainForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.buttonApprove = new System.Windows.Forms.Button();
            this.buttonRefuse = new System.Windows.Forms.Button();
            this.buttonClose = new System.Windows.Forms.Button();
            this.labelClientCode = new System.Windows.Forms.Label();
            this.textClientCode = new System.Windows.Forms.TextBox();
            this.buttonManual = new System.Windows.Forms.Button();
            this.checkIsCompanyLLC = new System.Windows.Forms.CheckBox();
            this.checkHasIDCard = new System.Windows.Forms.CheckBox();
            this.buttonGive = new System.Windows.Forms.Button();
            this.buttonCorporate = new System.Windows.Forms.Button();
            this.checkIsRefinancing = new System.Windows.Forms.CheckBox();
            this.checkHasMultipleOwners = new System.Windows.Forms.CheckBox();
            this.checkOnlyRefinancing = new System.Windows.Forms.CheckBox();
            this.buttonMessage = new System.Windows.Forms.Button();
            this.buttonLSRefuse = new System.Windows.Forms.Button();
            this.buttonLSApprove = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // buttonApprove
            // 
            this.buttonApprove.Location = new System.Drawing.Point(25, 187);
            this.buttonApprove.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.buttonApprove.Name = "buttonApprove";
            this.buttonApprove.Size = new System.Drawing.Size(92, 32);
            this.buttonApprove.TabIndex = 0;
            this.buttonApprove.Text = "Approve";
            this.buttonApprove.UseVisualStyleBackColor = true;
            this.buttonApprove.Click += new System.EventHandler(this.buttonApprove_Click);
            // 
            // buttonRefuse
            // 
            this.buttonRefuse.Location = new System.Drawing.Point(25, 130);
            this.buttonRefuse.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.buttonRefuse.Name = "buttonRefuse";
            this.buttonRefuse.Size = new System.Drawing.Size(92, 32);
            this.buttonRefuse.TabIndex = 1;
            this.buttonRefuse.Text = "Refuse";
            this.buttonRefuse.UseVisualStyleBackColor = true;
            this.buttonRefuse.Click += new System.EventHandler(this.buttonRefuse_Click);
            // 
            // buttonClose
            // 
            this.buttonClose.Location = new System.Drawing.Point(515, 187);
            this.buttonClose.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.buttonClose.Name = "buttonClose";
            this.buttonClose.Size = new System.Drawing.Size(92, 32);
            this.buttonClose.TabIndex = 2;
            this.buttonClose.Text = "Close";
            this.buttonClose.UseVisualStyleBackColor = true;
            this.buttonClose.Click += new System.EventHandler(this.buttonClose_Click);
            // 
            // labelClientCode
            // 
            this.labelClientCode.AutoSize = true;
            this.labelClientCode.Location = new System.Drawing.Point(21, 21);
            this.labelClientCode.Name = "labelClientCode";
            this.labelClientCode.Size = new System.Drawing.Size(78, 17);
            this.labelClientCode.TabIndex = 3;
            this.labelClientCode.Text = "Client code";
            // 
            // textClientCode
            // 
            this.textClientCode.Location = new System.Drawing.Point(121, 18);
            this.textClientCode.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.textClientCode.Name = "textClientCode";
            this.textClientCode.Size = new System.Drawing.Size(103, 22);
            this.textClientCode.TabIndex = 4;
            // 
            // buttonManual
            // 
            this.buttonManual.Location = new System.Drawing.Point(191, 130);
            this.buttonManual.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.buttonManual.Name = "buttonManual";
            this.buttonManual.Size = new System.Drawing.Size(92, 32);
            this.buttonManual.TabIndex = 6;
            this.buttonManual.Text = "Manual";
            this.buttonManual.UseVisualStyleBackColor = true;
            this.buttonManual.Click += new System.EventHandler(this.buttonManual_Click);
            // 
            // checkIsCompanyLLC
            // 
            this.checkIsCompanyLLC.AutoSize = true;
            this.checkIsCompanyLLC.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.checkIsCompanyLLC.Location = new System.Drawing.Point(417, 22);
            this.checkIsCompanyLLC.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.checkIsCompanyLLC.Name = "checkIsCompanyLLC";
            this.checkIsCompanyLLC.Size = new System.Drawing.Size(132, 21);
            this.checkIsCompanyLLC.TabIndex = 7;
            this.checkIsCompanyLLC.Text = "Is Company LLC";
            this.checkIsCompanyLLC.UseVisualStyleBackColor = true;
            this.checkIsCompanyLLC.CheckedChanged += new System.EventHandler(this.checkIsCompanyLLC_CheckedChanged);
            // 
            // checkHasIDCard
            // 
            this.checkHasIDCard.AutoSize = true;
            this.checkHasIDCard.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.checkHasIDCard.Location = new System.Drawing.Point(25, 71);
            this.checkHasIDCard.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.checkHasIDCard.Name = "checkHasIDCard";
            this.checkHasIDCard.Size = new System.Drawing.Size(106, 21);
            this.checkHasIDCard.TabIndex = 8;
            this.checkHasIDCard.Text = "Has ID Card";
            this.checkHasIDCard.UseVisualStyleBackColor = true;
            // 
            // buttonGive
            // 
            this.buttonGive.Location = new System.Drawing.Point(191, 187);
            this.buttonGive.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.buttonGive.Name = "buttonGive";
            this.buttonGive.Size = new System.Drawing.Size(92, 32);
            this.buttonGive.TabIndex = 9;
            this.buttonGive.Text = "Complete";
            this.buttonGive.UseVisualStyleBackColor = true;
            this.buttonGive.Click += new System.EventHandler(this.buttonGive_Click);
            // 
            // buttonCorporate
            // 
            this.buttonCorporate.Location = new System.Drawing.Point(367, 130);
            this.buttonCorporate.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.buttonCorporate.Name = "buttonCorporate";
            this.buttonCorporate.Size = new System.Drawing.Size(92, 32);
            this.buttonCorporate.TabIndex = 10;
            this.buttonCorporate.Text = "Corporate";
            this.buttonCorporate.UseVisualStyleBackColor = true;
            this.buttonCorporate.Click += new System.EventHandler(this.buttonCorporate_Click);
            // 
            // checkIsRefinancing
            // 
            this.checkIsRefinancing.AutoSize = true;
            this.checkIsRefinancing.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.checkIsRefinancing.Location = new System.Drawing.Point(253, 22);
            this.checkIsRefinancing.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.checkIsRefinancing.Name = "checkIsRefinancing";
            this.checkIsRefinancing.Size = new System.Drawing.Size(119, 21);
            this.checkIsRefinancing.TabIndex = 11;
            this.checkIsRefinancing.Text = "Is Refinancing";
            this.checkIsRefinancing.UseVisualStyleBackColor = true;
            this.checkIsRefinancing.CheckedChanged += new System.EventHandler(this.checkIsRefinancing_CheckedChanged);
            // 
            // checkHasMultipleOwners
            // 
            this.checkHasMultipleOwners.AutoSize = true;
            this.checkHasMultipleOwners.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.checkHasMultipleOwners.Location = new System.Drawing.Point(443, 71);
            this.checkHasMultipleOwners.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.checkHasMultipleOwners.Name = "checkHasMultipleOwners";
            this.checkHasMultipleOwners.Size = new System.Drawing.Size(159, 21);
            this.checkHasMultipleOwners.TabIndex = 12;
            this.checkHasMultipleOwners.Text = "Has Multiple Owners";
            this.checkHasMultipleOwners.UseVisualStyleBackColor = true;
            this.checkHasMultipleOwners.CheckedChanged += new System.EventHandler(this.checkHasMultipleOwners_CheckedChanged);
            // 
            // checkOnlyRefinancing
            // 
            this.checkOnlyRefinancing.AutoSize = true;
            this.checkOnlyRefinancing.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.checkOnlyRefinancing.Location = new System.Drawing.Point(273, 71);
            this.checkOnlyRefinancing.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.checkOnlyRefinancing.Name = "checkOnlyRefinancing";
            this.checkOnlyRefinancing.Size = new System.Drawing.Size(138, 21);
            this.checkOnlyRefinancing.TabIndex = 13;
            this.checkOnlyRefinancing.Text = "Only Refinancing";
            this.checkOnlyRefinancing.UseVisualStyleBackColor = true;
            this.checkOnlyRefinancing.CheckedChanged += new System.EventHandler(this.checkOnlyRefinancing_CheckedChanged);
            // 
            // buttonMessage
            // 
            this.buttonMessage.Location = new System.Drawing.Point(367, 187);
            this.buttonMessage.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.buttonMessage.Name = "buttonMessage";
            this.buttonMessage.Size = new System.Drawing.Size(92, 32);
            this.buttonMessage.TabIndex = 14;
            this.buttonMessage.Text = "Messages";
            this.buttonMessage.UseVisualStyleBackColor = true;
            this.buttonMessage.Click += new System.EventHandler(this.buttonMessage_Click);
            // 
            // buttonLSRefuse
            // 
            this.buttonLSRefuse.Location = new System.Drawing.Point(191, 244);
            this.buttonLSRefuse.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.buttonLSRefuse.Name = "buttonLSRefuse";
            this.buttonLSRefuse.Size = new System.Drawing.Size(92, 32);
            this.buttonLSRefuse.TabIndex = 15;
            this.buttonLSRefuse.Text = "LS Refuse";
            this.buttonLSRefuse.UseVisualStyleBackColor = true;
            this.buttonLSRefuse.Click += new System.EventHandler(this.buttonLSRefuse_Click);
            // 
            // buttonLSApprove
            // 
            this.buttonLSApprove.Location = new System.Drawing.Point(25, 244);
            this.buttonLSApprove.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.buttonLSApprove.Name = "buttonLSApprove";
            this.buttonLSApprove.Size = new System.Drawing.Size(92, 32);
            this.buttonLSApprove.TabIndex = 16;
            this.buttonLSApprove.Text = "LS Approve";
            this.buttonLSApprove.UseVisualStyleBackColor = true;
            this.buttonLSApprove.Click += new System.EventHandler(this.buttonLSApprove_Click);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(621, 298);
            this.Controls.Add(this.buttonLSApprove);
            this.Controls.Add(this.buttonLSRefuse);
            this.Controls.Add(this.buttonMessage);
            this.Controls.Add(this.checkOnlyRefinancing);
            this.Controls.Add(this.checkHasMultipleOwners);
            this.Controls.Add(this.checkIsRefinancing);
            this.Controls.Add(this.buttonCorporate);
            this.Controls.Add(this.buttonGive);
            this.Controls.Add(this.checkHasIDCard);
            this.Controls.Add(this.checkIsCompanyLLC);
            this.Controls.Add(this.buttonManual);
            this.Controls.Add(this.textClientCode);
            this.Controls.Add(this.labelClientCode);
            this.Controls.Add(this.buttonClose);
            this.Controls.Add(this.buttonRefuse);
            this.Controls.Add(this.buttonApprove);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.Name = "MainForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Process applications";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button buttonApprove;
        private System.Windows.Forms.Button buttonRefuse;
        private System.Windows.Forms.Button buttonClose;
        private System.Windows.Forms.Label labelClientCode;
        private System.Windows.Forms.TextBox textClientCode;
        private System.Windows.Forms.Button buttonManual;
        private System.Windows.Forms.CheckBox checkIsCompanyLLC;
        private System.Windows.Forms.CheckBox checkHasIDCard;
        private System.Windows.Forms.Button buttonGive;
        private System.Windows.Forms.Button buttonCorporate;
        private System.Windows.Forms.CheckBox checkIsRefinancing;
        private System.Windows.Forms.CheckBox checkHasMultipleOwners;
        private System.Windows.Forms.CheckBox checkOnlyRefinancing;
        private System.Windows.Forms.Button buttonMessage;
        private System.Windows.Forms.Button buttonLSRefuse;
        private System.Windows.Forms.Button buttonLSApprove;
    }
}

