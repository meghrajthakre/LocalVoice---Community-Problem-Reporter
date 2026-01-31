const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        // Title in original and translated versions
        title: {
            original: {
                type: String,
                required: [true, 'Title is required'],
                trim: true,
                minlength: [5, 'Title must be at least 5 characters long'],
                maxlength: [200, 'Title cannot exceed 200 characters']
            },
            translated: {
                type: String,
                default: ''
            }
        },

        // Description in original and translated versions
        description: {
            original: {
                type: String,
                required: [true, 'Description is required'],
                trim: true,
                minlength: [10, 'Description must be at least 10 characters long'],
                maxlength: [2000, 'Description cannot exceed 2000 characters']
            },
            translated: {
                type: String,
                default: ''
            }
        },

        // Category of the problem
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['pothole', 'streetlight', 'garbage', 'drainage', 'road', 'water', 'electricity', 'safety', 'noise', 'construction', 'other'],
                message: '{VALUE} is not a valid category'
            },
            default: 'other'
        },

        // Location information
        location: {
            address: {
                type: String,
                required: [true, 'Address is required'],
                trim: true
            },
            coordinates: {
                type: {
                    type: String,
                    enum: ["Point"],
                    default: "Point"
                },
                coordinates: {
                    type: [Number], // [lng, lat]
                    required: true
                }
            },
            city: {
                type: String,
                trim: true
            },
            state: {
                type: String,
                trim: true
            },
            zipCode: {
                type: String,
                trim: true
            },
            landmark: {
                type: String,
                trim: true
            }
        },

        // Image/Photo evidence
        image: {
            url: {
                type: String,
                default: null
            },
            publicId: {
                type: String,
                default: null
            },
            thumbnailUrl: {
                type: String,
                default: null
            }
        },

        // Status of the report
        status: {
            type: String,
            enum: {
                values: ['new', 'in-progress', 'resolved', 'rejected', 'duplicate'],
                message: '{VALUE} is not a valid status'
            },
            default: 'new'
        },

        // Priority level
        priority: {
            type: String,
            enum: {
                values: ['low', 'medium', 'high', 'urgent'],
                message: '{VALUE} is not a valid priority'
            },
            default: 'medium'
        },

        // Language codes (ISO 639-1)
        language: {
            type: String,
            required: [true, 'Language is required'],
            trim: true,
            lowercase: true,
            default: 'en'
        },

        // Admin's preferred language for viewing
        adminLanguage: {
            type: String,
            trim: true,
            lowercase: true,
            default: 'en'
        },

        // Admin responses to the report
        responses: [
            {
                text: {
                    original: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    translated: {
                        type: String,
                        default: ''
                    }
                },
                respondedBy: {
                    type: String,
                    required: true,
                    trim: true
                },
                respondedByEmail: {
                    type: String,
                    trim: true
                },
                respondedAt: {
                    type: Date,
                    default: Date.now
                },
                language: {
                    type: String,
                    default: 'en'
                }
            }
        ],

        // Reporter information
        reportedBy: {
            name: {
                type: String,
                required: [true, 'Reporter name is required'],
                trim: true
            },
            email: {
                type: String,
                required: [true, 'Reporter email is required'],
                trim: true,
                lowercase: true,
                match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
            },
            phone: {
                type: String,
                trim: true,
                match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number']
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: null
            }
        },

        // Status history (track all status changes)
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: ['new', 'in-progress', 'resolved', 'rejected', 'duplicate']
                },
                changedBy: {
                    type: String,
                    trim: true
                },
                changedAt: {
                    type: Date,
                    default: Date.now
                },
                comment: {
                    type: String,
                    trim: true
                }
            }
        ],

        // Votes/Upvotes (community engagement)
        votes: {
            type: Number,
            default: 0,
            min: [0, 'Votes cannot be negative']
        },

        // Array of user IDs who voted
        votedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],

        // Views count
        views: {
            type: Number,
            default: 0,
            min: [0, 'Views cannot be negative']
        },

        // Tags for better categorization
        tags: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],

        // Resolution information
        resolution: {
            resolvedAt: {
                type: Date,
                default: null
            },
            resolvedBy: {
                type: String,
                trim: true
            },
            resolutionNotes: {
                type: String,
                trim: true
            },
            resolutionTime: {
                type: Number, // in hours
                default: null
            }
        },

        // Admin notes (internal, not visible to citizens)
        adminNotes: {
            type: String,
            trim: true,
            default: ''
        },

        // Flag for inappropriate content
        isFlagged: {
            type: Boolean,
            default: false
        },

        // Flag reason
        flagReason: {
            type: String,
            trim: true
        },

        // Soft delete flag
        isDeleted: {
            type: Boolean,
            default: false
        },

        // Assigned to (admin user)
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for better query performance
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ category: 1, status: 1 });
reportSchema.index({ 'location.coordinates': '2dsphere' }); // For geospatial queries
reportSchema.index({ language: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ 'reportedBy.email': 1 });
reportSchema.index({ priority: 1, status: 1 });

// Virtual for time since creation
reportSchema.virtual('timeSinceCreation').get(function () {
    const now = new Date();
    const diff = now - this.createdAt;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
        return `${hours} hours ago`;
    } else {
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    }
});

// Virtual for resolution time in days
reportSchema.virtual('resolutionDays').get(function () {
    if (this.resolution.resolvedAt && this.createdAt) {
        const diff = this.resolution.resolvedAt - this.createdAt;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return days;
    }
    return null;
});

// Virtual for full location string
reportSchema.virtual('fullLocation').get(function () {
    const parts = [
        this.location.address,
        this.location.landmark,
        this.location.city,
        this.location.state,
        this.location.zipCode
    ].filter(Boolean);
    return parts.join(', ');
});

// Pre-save middleware to add status to history
reportSchema.pre('save', function (next) {
    if (this.isModified('status') && !this.isNew) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date()
        });
    }
    next();
});

// Pre-save middleware to calculate resolution time
reportSchema.pre('save', function (next) {
    if (this.status === 'resolved' && !this.resolution.resolvedAt) {
        this.resolution.resolvedAt = new Date();
        const diff = this.resolution.resolvedAt - this.createdAt;
        this.resolution.resolutionTime = Math.floor(diff / (1000 * 60 * 60)); // in hours
    }
    next();
});

// Static method to get statistics
reportSchema.statics.getStatistics = async function () {
    const stats = await this.aggregate([
        {
            $facet: {
                total: [{ $count: 'count' }],
                byStatus: [
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 }
                        }
                    }
                ],
                byCategory: [
                    {
                        $group: {
                            _id: '$category',
                            count: { $sum: 1 }
                        }
                    }
                ],
                byPriority: [
                    {
                        $group: {
                            _id: '$priority',
                            count: { $sum: 1 }
                        }
                    }
                ],
                avgResolutionTime: [
                    {
                        $match: {
                            status: 'resolved',
                            'resolution.resolutionTime': { $ne: null }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            avgTime: { $avg: '$resolution.resolutionTime' }
                        }
                    }
                ]
            }
        }
    ]);

    return stats[0];
};

// Static method to find nearby reports (geospatial)
reportSchema.statics.findNearby = async function (lat, lng, maxDistance = 5000) {
    return this.find({
        'location.coordinates': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                $maxDistance: maxDistance // in meters
            }
        }
    });
};

// Instance method to add response
reportSchema.methods.addResponse = function (responseData) {
    this.responses.push(responseData);
    return this.save();
};

// Instance method to update status
reportSchema.methods.updateStatus = function (newStatus, changedBy, comment) {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        changedBy,
        changedAt: new Date(),
        comment
    });
    return this.save();
};

// Instance method to increment votes
reportSchema.methods.upvote = function (userId) {
    if (!this.votedBy.includes(userId)) {
        this.votes += 1;
        this.votedBy.push(userId);
        return this.save();
    }
    return Promise.resolve(this);
};

// Instance method to increment views
reportSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;