<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttackTest extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function engraving(): BelongsTo
    {
        return $this->belongsTo(Engraving::class);
    }
}
