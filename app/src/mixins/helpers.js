/**
 * @notice Helper functions
 */
import { Notify } from 'quasar';

export default {

  methods: {
    /**
     * Present notification alert to the user
     * @param {string} color alert color, choose positive, negative, warning, info, or others
     * @param {string} message message to display on notification
     */
    notifyUser(color, message) {
      Notify.create({
        color,
        message,
        // If positive, timeout after 5 seconds. Otherwise, show until dismissed by user
        timeout: color.toLowerCase() === 'positive' ? 5000 : 0,
        position: 'top',
        actions: [{ label: 'Dismiss', color: 'white' }],
      });
    },
  },
};
