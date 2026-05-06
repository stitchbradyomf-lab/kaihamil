#!/usr/bin/env node
/**
 * Setup script for Time & Focus PocketBase collections
 * Run this to create the required collections in your PocketBase instance
 */

import PocketBase from 'pocketbase';

const PB_URL = process.env.PB_URL || 'http://192.241.180.69:8090';
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'kyle@kaihamil.com';
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!PB_ADMIN_PASSWORD) {
  console.error('Error: PB_ADMIN_PASSWORD environment variable required');
  console.error('Usage: PB_ADMIN_PASSWORD=yourpassword node setup-pocketbase.js');
  process.exit(1);
}

const pb = new PocketBase(PB_URL);

async function setup() {
  try {
    // Authenticate as admin
    await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
    console.log('✓ Authenticated as admin');

    // Check if time_focus_entries collection exists
    try {
      await pb.collections.getOne('time_focus_entries');
      console.log('✓ time_focus_entries collection already exists');
    } catch {
      console.log('Creating time_focus_entries collection...');
      
      await pb.collections.create({
        name: 'time_focus_entries',
        type: 'base',
        schema: [
          {
            name: 'user_id',
            type: 'relation',
            required: true,
            options: {
              collectionId: '_pb_users_auth_',
              cascadeDelete: true
            }
          },
          {
            name: 'entry_date',
            type: 'date',
            required: true
          },
          {
            name: 'ratings',
            type: 'json',
            required: false
          },
          {
            name: 'aggregate',
            type: 'json',
            required: false
          },
          {
            name: 'reflection',
            type: 'text',
            required: false
          },
          {
            name: 'metadata',
            type: 'json',
            required: false
          }
        ],
        indexes: [
          'CREATE INDEX idx_time_focus_user_date ON time_focus_entries (user_id, entry_date)'
        ]
      });
      
      console.log('✓ Created time_focus_entries collection');
    }

    // Check if intentions collection exists
    try {
      await pb.collections.getOne('intentions');
      console.log('✓ intentions collection already exists');
    } catch {
      console.log('Creating intentions collection...');
      
      await pb.collections.create({
        name: 'intentions',
        type: 'base',
        schema: [
          {
            name: 'user',
            type: 'relation',
            required: true,
            options: {
              collectionId: '_pb_users_auth_',
              cascadeDelete: true
            }
          },
          {
            name: 'period',
            type: 'select',
            required: true,
            options: {
              values: ['week', 'month', 'quarter']
            }
          },
          {
            name: 'period_start',
            type: 'date',
            required: true
          },
          {
            name: 'period_end',
            type: 'date',
            required: true
          },
          {
            name: 'target_kids',
            type: 'number',
            required: false
          },
          {
            name: 'target_partner',
            type: 'number',
            required: false
          },
          {
            name: 'target_work',
            type: 'number',
            required: false
          },
          {
            name: 'target_business',
            type: 'number',
            required: false
          },
          {
            name: 'target_sleep',
            type: 'number',
            required: false
          },
          {
            name: 'focus_areas',
            type: 'json',
            required: false
          }
        ]
      });
      
      console.log('✓ Created intentions collection');
    }

    console.log('\n✓ Setup complete!');
    console.log('Collections ready: users, time_focus_entries, intentions');
    
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  }
}

setup();
