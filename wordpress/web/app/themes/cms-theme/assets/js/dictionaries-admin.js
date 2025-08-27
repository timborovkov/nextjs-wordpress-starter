jQuery(document).ready(function ($) {
  "use strict";

  // Initialize dictionaries admin functionality
  var DictionariesAdmin = {
    init: function () {
      this.bindEvents();
      this.setupFormValidation();
      this.updateRowIndexes();
    },

    bindEvents: function () {
      // Add new translation row
      $(document).on("click", ".add-row", function (e) {
        e.preventDefault();
        DictionariesAdmin.addNewRow();
      });

      // Remove translation row
      $(document).on("click", ".remove-row", function (e) {
        e.preventDefault();
        DictionariesAdmin.removeRow($(this));
      });

      // Save all changes
      $(document).on("click", ".save-all", function (e) {
        e.preventDefault();
        DictionariesAdmin.saveAllChanges();
      });

      // Auto-save on input change (optional)
      $(document).on(
        "input",
        ".translation-key, .translation-value",
        function () {
          DictionariesAdmin.debounce(DictionariesAdmin.markAsChanged, 1000)();
        }
      );

      // Keyboard shortcuts
      $(document).on("keydown", function (e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          DictionariesAdmin.saveAllChanges();
        }

        // Ctrl/Cmd + Enter to add new row
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          DictionariesAdmin.addNewRow();
        }
      });
    },

    setupFormValidation: function () {
      // Add validation attributes
      $(".translation-key").attr("required", "required");
    },

    addNewRow: function () {
      var template = $("#dictionary-row-template").html();
      var newIndex = $(".dictionary-row").length;

      var entryHtml = template.replace(/\{\{index\}\}/g, newIndex);

      $("#dictionaries-tbody").append(entryHtml);

      // Focus on the new key input
      $(
        "#dictionaries-tbody .dictionary-row:last-child .translation-key"
      ).focus();

      // Add highlight class
      $("#dictionaries-tbody .dictionary-row:last-child").addClass("new-row");

      // Update all indexes after adding
      this.updateRowIndexes();

      // Remove highlight after animation
      setTimeout(() => {
        $("#dictionaries-tbody .dictionary-row:last-child").removeClass(
          "new-row"
        );
      }, 2000);
    },

    removeRow: function (button) {
      if (confirm(dictionariesAjax.strings.confirmDelete)) {
        var row = button.closest(".dictionary-row");

        row.addClass("removing");

        setTimeout(() => {
          row.remove();
          DictionariesAdmin.updateRowIndexes();

          // Show empty state if no rows
          if ($(".dictionary-row").length === 0) {
            $("#dictionaries-tbody").trigger("empty");
          }
        }, 300);
      }
    },

    updateRowIndexes: function () {
      $(".dictionary-row").each(function (index) {
        $(this).attr("data-index", index);
      });
    },

    markAsChanged: function () {
      // Optional: Mark rows as changed for visual feedback
      console.log("Content changed, ready to save");
    },

    saveAllChanges: function () {
      var saveButton = $(".save-all");
      var originalText = saveButton.text();

      // Disable save button and show loading state
      saveButton.prop("disabled", true).text(dictionariesAjax.strings.saving);

      // Collect all translation data
      var translations = [];
      $(".dictionary-row").each(function () {
        var row = $(this);
        var key = row.find(".translation-key").val().trim();
        var values = {};

        // Collect values for each language
        row.find(".translation-value").each(function () {
          var langCell = $(this).closest(".lang-cell");
          var langCode = langCell.data("lang");
          var value = $(this).val().trim();
          if (value) {
            values[langCode] = value;
          }
        });

        if (key) {
          translations.push({
            key: key,
            values: values,
          });
        }
      });

      // Validate data
      if (!this.validateTranslations(translations)) {
        saveButton.prop("disabled", false).text(originalText);
        return;
      }

      // Send AJAX request
      $.ajax({
        url: dictionariesAjax.ajaxurl,
        type: "POST",
        data: {
          action: "save_dictionaries",
          nonce: dictionariesAjax.nonce,
          translations: translations,
        },
        success: function (response) {
          if (response.success) {
            DictionariesAdmin.showMessage(
              dictionariesAjax.strings.saved,
              "success"
            );
          } else {
            DictionariesAdmin.showMessage(
              response.data || dictionariesAjax.strings.error,
              "error"
            );
          }
        },
        error: function () {
          DictionariesAdmin.showMessage(
            dictionariesAjax.strings.error,
            "error"
          );
        },
        complete: function () {
          saveButton.prop("disabled", false).text(originalText);
        },
      });
    },

    validateTranslations: function (translations) {
      var isValid = true;
      var errors = [];

      // Clear previous error states
      $(".translation-key, .translation-value").removeClass("error");

      if (translations.length === 0) {
        this.showMessage("No translations to save.", "info");
        return false;
      }

      translations.forEach((translation, index) => {
        if (!translation.key) {
          errors.push("Translation key is required for row " + (index + 1));
          $(".dictionary-row")
            .eq(index)
            .find(".translation-key")
            .addClass("error");
          isValid = false;
        }

        // Check if at least one language has a value
        var hasValue = false;
        Object.values(translation.values).forEach((value) => {
          if (value && value.trim()) {
            hasValue = true;
          }
        });

        if (!hasValue) {
          errors.push(
            "At least one translation value is required for key '" +
              translation.key +
              "'"
          );
          $(".dictionary-row")
            .eq(index)
            .find(".translation-value")
            .addClass("error");
          isValid = false;
        }
      });

      if (!isValid) {
        this.showMessage(
          "Please fix the following errors:\n" + errors.join("\n"),
          "error"
        );
      }

      return isValid;
    },

    showMessage: function (message, type) {
      var messageClass = "save-message " + (type || "info");
      var messageHtml =
        '<div class="' + messageClass + '">' + message + "</div>";

      // Remove existing messages
      $(".save-message").remove();

      // Add new message
      $("#save-status").html(messageHtml);

      // Auto-remove after 5 seconds
      setTimeout(function () {
        $(".save-message").fadeOut(300, function () {
          $(this).remove();
        });
      }, 5000);
    },

    debounce: function (func, wait) {
      var timeout;
      return function executedFunction() {
        var later = function () {
          clearTimeout(timeout);
          func();
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  };

  // Initialize the admin functionality
  DictionariesAdmin.init();

  // Add some additional UX improvements
  $(document).on(
    "keydown",
    ".translation-key, .translation-value",
    function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var currentRow = $(this).closest(".dictionary-row");

        // If we're in the key field, move to first value field
        if ($(this).hasClass("translation-key")) {
          currentRow.find(".translation-value").first().focus();
        } else {
          // If we're in a value field, move to next value field or add new row
          var currentValueField = $(this);
          var nextValueField = currentValueField
            .closest(".lang-cell")
            .next(".lang-cell")
            .find(".translation-value");

          if (nextValueField.length) {
            nextValueField.focus();
          } else {
            // Last value field, add new row
            DictionariesAdmin.addNewRow();
          }
        }
      }
    }
  );

  // Add tooltips for keyboard shortcuts
  $(".add-row").attr("title", "Click to add new translation (Ctrl+Enter)");
  $(".save-all").attr("title", "Save all changes (Ctrl+S)");

  // Auto-save indicator
  var autoSaveIndicator = $(
    '<div class="auto-save-indicator" style="display: none; font-size: 12px; color: #666; margin-top: 10px;">Auto-save available</div>'
  );
  $(".dictionaries-actions").after(autoSaveIndicator);

  // Show auto-save indicator when content changes
  $(document).on("input", ".translation-key, .translation-value", function () {
    autoSaveIndicator.show().text("Content changed - press Ctrl+S to save");

    // Hide after 3 seconds
    setTimeout(() => {
      autoSaveIndicator.fadeOut();
    }, 3000);
  });
});
